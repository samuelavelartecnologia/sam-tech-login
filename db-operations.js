// License operations
const saveLicense = async (licenseData) => {
    try {
        await db.collection('licenses').doc(licenseData.key).set({
            key: licenseData.key,
            dataAtivacao: firebase.firestore.Timestamp.now(),
            expiraEm: licenseData.expiraEm,
            status: 'active',
            tipo: licenseData.tipo,
            usuarioId: licenseData.usuarioId
        });
        return true;
    } catch (error) {
        console.error('Error saving license:', error);
        return false;
    }
};

const checkLicense = async (licenseKey) => {
    try {
        const doc = await db.collection('licenses').doc(licenseKey).get();
        if (doc.exists) {
            return doc.data();
        }
        return null;
    } catch (error) {
        console.error('Error checking license:', error);
        return null;
    }
};

// User operations
const saveUser = async (userData) => {
    try {
        await db.collection('users').doc(userData.id).set({
            email: userData.email,
            nome: userData.nome,
            telefone: userData.telefone,
            dataCadastro: firebase.firestore.Timestamp.now()
        });
        return true;
    } catch (error) {
        console.error('Error saving user:', error);
        return false;
    }
};