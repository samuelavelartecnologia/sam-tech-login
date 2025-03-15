// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
import { getFirestore, collection, doc, getDoc, setDoc, updateDoc, query, where, limit, getDocs, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-analytics.js";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAY4nbAihrmDH6q7yDrVQiAzIklx9D3Zss",
    authDomain: "samstech-d96cd.firebaseapp.com",
    projectId: "samstech-d96cd",
    storageBucket: "samstech-d96cd.appspot.com",
    messagingSenderId: "378706712897",
    appId: "1:378706712897:web:ebff2cce9749e2d58ea9c0",
    measurementId: "G-HR6LP9QFSW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Coleções do Firestore
const usersCollection = collection(db, 'usuarios');
const licensesCollection = collection(db, 'licencas');

// Objeto para gerenciar autenticação
const firebaseAuth = {
    // Criar novo usuário
    registrarUsuario: async (email, password, userData) => {
        try {
            console.log(`Tentando registrar usuário: ${email}`);
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            
            await setDoc(doc(db, 'usuarios', user.uid), {
                email: email,
                empresa: userData.empresa,
                telefone: userData.telefone,
                dataCriacao: serverTimestamp(),
                ultimoLogin: serverTimestamp(),
                status: "pendente"
            });
            
            console.log("Dados do usuário salvos na coleção 'usuarios'");
            return { success: true, userId: user.uid };
        } catch (error) {
            console.error("Erro ao registrar usuário:", error);
            return { success: false, error: error.message };
        }
    },
    
    // Login de usuário
    loginUsuario: async (email, password) => {
        try {
            console.log(`Tentando login para: ${email}`);
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            console.log("Login bem-sucedido:", user.uid);
            
            try {
                const userRef = doc(db, 'usuarios', user.uid);
                await updateDoc(userRef, {
                    ultimoLogin: serverTimestamp()
                });
                console.log("Timestamp de login atualizado");
                
                const userDoc = await getDoc(userRef);
                return { 
                    success: true, 
                    user: user,
                    userData: userDoc.exists() ? userDoc.data() : null
                };
            } catch (firestoreError) {
                console.error("Erro ao atualizar dados no Firestore:", firestoreError);
                return { 
                    success: true, 
                    user: user,
                    userData: null
                };
            }
        } catch (error) {
            console.error("Erro ao fazer login:", error);
            return { success: false, error: error.message };
        }
    },
    
    // Recuperar senha
    recuperarSenha: async (email) => {
        try {
            await sendPasswordResetEmail(auth, email);
            return { success: true };
        } catch (error) {
            console.error("Erro ao enviar email de recuperação:", error);
            return { success: false, error: error.message };
        }
    },
    
    // Verificar estado de autenticação
    verificarUsuarioLogado: () => {
        return new Promise((resolve) => {
            onAuthStateChanged(auth, (user) => {
                if (user) {
                    resolve({ loggedIn: true, user: user });
                } else {
                    resolve({ loggedIn: false, user: null });
                }
            });
        });
    }
};

// Funções para gerenciamento de licenças
const licenseManager = {
    // Verificar licença
    verificarLicenca: async (licenseKey, userId) => {
        try {
            console.log(`Verificando licença: ${licenseKey} para usuário: ${userId}`);
            const licenseQuery = query(
                licensesCollection,
                where('chave', '==', licenseKey),
                limit(1)
            );
            
            const querySnapshot = await getDocs(licenseQuery);
            
            if (querySnapshot.empty) {
                console.log("Licença não encontrada");
                return { 
                    success: false, 
                    error: 'Licença não encontrada' 
                };
            }
            
            const licenseDoc = querySnapshot.docs[0];
            const licenseData = licenseDoc.data();
            console.log("Licença encontrada:", licenseData);
            
            // Verificar se a licença está ativa
            if (licenseData.status !== 'ativa') {
                console.log("Licença inativa ou expirada");
                return { 
                    success: false, 
                    error: 'Licença inativa ou expirada',
                    licenseData: licenseData
                };
            }
            
            // Verificar se a licença já está atribuída a outro usuário
            if (licenseData.usuarioId && licenseData.usuarioId !== userId) {
                console.log("Licença já em uso por outro usuário");
                return { 
                    success: false, 
                    error: 'Esta licença já está em uso por outro usuário' 
                };
            }
            
            // Verificar data de expiração
            const expiraEm = licenseData.expiraEm.toDate();
            const hoje = new Date();
            
            if (expiraEm < hoje) {
                console.log("Licença expirada");
                // Atualizar status da licença para expirada
                await updateDoc(doc(licensesCollection, licenseDoc.id), {
                    status: 'expirada'
                });
                
                return { 
                    success: false, 
                    error: 'Licença expirada',
                    licenseData: {
                        ...licenseData,
                        status: 'expirada'
                    }
                };
            }
            
            // Se licença não estiver atribuída, atribuir ao usuário atual
            if (!licenseData.usuarioId) {
                console.log("Atribuindo licença ao usuário");
                await updateDoc(doc(licensesCollection, licenseDoc.id), {
                    usuarioId: userId,
                    dataAtivacao: serverTimestamp()
                });
            }
            
            // Registrar uso da licença
            await addDoc(collection(licensesCollection, doc(licensesCollection, licenseDoc.id).collection('acessos')), {
                usuarioId: userId,
                timestamp: serverTimestamp(),
                ip: 'não registrado' // Em produção, capturar IP real
            });
            
            console.log("Licença validada com sucesso");
            return { 
                success: true, 
                licenseData: licenseData 
            };
        } catch (error) {
            console.error("Erro ao verificar licença:", error);
            return { success: false, error: error.message };
        }
    },
    
    // Obter dados da licença de um usuário
    obterLicencaUsuario: async (userId) => {
        try {
            console.log(`Buscando licença para usuário: ${userId}`);
            const licenseQuery = query(licensesCollection, where('usuarioId', '==', userId))
                .limit(1)
                .get();
            
            const querySnapshot = await getDocs(licenseQuery);
            
            if (querySnapshot.empty) {
                console.log("Nenhuma licença encontrada para este usuário");
                return { 
                    success: false, 
                    error: 'Nenhuma licença encontrada para este usuário' 
                };
            }
            
            const licenseDoc = querySnapshot.docs[0];
            const licenseData = licenseDoc.data();
            console.log("Licença encontrada:", licenseData);
            
            return { 
                success: true, 
                licenseData: licenseData 
            };
        } catch (error) {
            console.error("Erro ao obter licença do usuário:", error);
            return { success: false, error: error.message };
        }
    }
};

// Exportar módulos
export { firebaseAuth, licenseManager };

// Log para confirmar que o módulo foi carregado
console.log("Firebase configurado e módulos exportados com sucesso");