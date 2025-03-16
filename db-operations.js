// Operações do banco de dados Firebase
const db = firebase.firestore();

// Função para criar uma nova licença
async function createLicense(licenseKey, duration = 30) {
    try {
        await db.collection('licenses').doc(licenseKey).set({
            isValid: true,
            isUsed: false,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            duration: duration, // duração em dias
            expiresAt: new Date(Date.now() + duration * 24 * 60 * 60 * 1000)
        });
        return true;
    } catch (error) {
        console.error('Erro ao criar licença:', error);
        return false;
    }
}

// Função para verificar o status de uma licença
async function checkLicenseStatus(licenseKey) {
    try {
        const doc = await db.collection('licenses').doc(licenseKey).get();
        if (doc.exists) {
            const data = doc.data();
            const now = new Date();
            const expiresAt = data.expiresAt.toDate();
            
            return {
                isValid: data.isValid,
                isUsed: data.isUsed,
                isExpired: now > expiresAt,
                daysRemaining: Math.ceil((expiresAt - now) / (1000 * 60 * 60 * 24)),
                machineId: data.machineId || null,
                usedAt: data.usedAt ? data.usedAt.toDate() : null
            };
        }
        return null;
    } catch (error) {
        console.error('Erro ao verificar licença:', error);
        return null;
    }
}

// Função para revogar uma licença
async function revokeLicense(licenseKey) {
    try {
        await db.collection('licenses').doc(licenseKey).update({
            isValid: false,
            revokedAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        return true;
    } catch (error) {
        console.error('Erro ao revogar licença:', error);
        return false;
    }
}

// Função para estender a duração de uma licença
async function extendLicense(licenseKey, additionalDays) {
    try {
        const doc = await db.collection('licenses').doc(licenseKey).get();
        if (doc.exists) {
            const data = doc.data();
            const currentExpiry = data.expiresAt.toDate();
            const newExpiry = new Date(currentExpiry.getTime() + additionalDays * 24 * 60 * 60 * 1000);
            
            await db.collection('licenses').doc(licenseKey).update({
                expiresAt: newExpiry,
                duration: data.duration + additionalDays
            });
            return true;
        }
        return false;
    } catch (error) {
        console.error('Erro ao estender licença:', error);
        return false;
    }
}

// Função para listar todas as licenças
async function listAllLicenses() {
    try {
        const snapshot = await db.collection('licenses').get();
        return snapshot.docs.map(doc => ({
            key: doc.id,
            ...doc.data(),
            expiresAt: doc.data().expiresAt.toDate(),
            createdAt: doc.data().createdAt.toDate(),
            usedAt: doc.data().usedAt ? doc.data().usedAt.toDate() : null
        }));
    } catch (error) {
        console.error('Erro ao listar licenças:', error);
        return [];
    }
}

// Função para transferir uma licença para outra máquina
async function transferLicense(licenseKey, newMachineId) {
    try {
        await db.collection('licenses').doc(licenseKey).update({
            machineId: newMachineId,
            transferredAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        return true;
    } catch (error) {
        console.error('Erro ao transferir licença:', error);
        return false;
    }
}

// Exportando as funções
window.dbOperations = {
    createLicense,
    checkLicenseStatus,
    revokeLicense,
    extendLicense,
    listAllLicenses,
    transferLicense
};
