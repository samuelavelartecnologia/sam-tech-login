// Funções para limpeza de dados do sistema Sam's Tech

// Função para limpar dados de licença
async function clearLicenseData() {
    try {
        // Remove dados do localStorage
        localStorage.removeItem('samsTechLicense');
        localStorage.removeItem('licenseStatus');
        localStorage.removeItem('licenseExpiry');
        localStorage.removeItem('machineId');

        // Remove cookies relacionados à licença
        document.cookie.split(";").forEach(function(c) {
            document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
        });

        // Limpa dados do IndexedDB se existirem
        const request = indexedDB.deleteDatabase('samsTechLicenseDB');
        
        request.onsuccess = function() {
            console.log('Banco de dados IndexedDB removido com sucesso');
        };

        return {
            success: true,
            message: 'Dados de licença removidos com sucesso'
        };
    } catch (error) {
        console.error('Erro ao limpar dados de licença:', error);
        return {
            success: false,
            message: 'Erro ao limpar dados de licença'
        };
    }
}

// Função para limpar cache do navegador
async function clearBrowserCache() {
    try {
        // Limpa cache de aplicação
        if ('caches' in window) {
            const cacheNames = await caches.keys();
            await Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName.includes('sams-tech')) {
                        return caches.delete(cacheName);
                    }
                })
            );
        }

        // Limpa service workers
        if ('serviceWorker' in navigator) {
            const registrations = await navigator.serviceWorker.getRegistrations();
            await Promise.all(
                registrations.map(registration => registration.unregister())
            );
        }

        return {
            success: true,
            message: 'Cache do navegador limpo com sucesso'
        };
    } catch (error) {
        console.error('Erro ao limpar cache:', error);
        return {
            success: false,
            message: 'Erro ao limpar cache do navegador'
        };
    }
}

// Função para redefinir configurações
async function resetSettings() {
    try {
        // Lista de todas as configurações para redefinir
        const settingsKeys = [
            'samsTechSettings',
            'userPreferences',
            'themeConfig',
            'notificationSettings',
            'lastSync'
        ];

        // Remove todas as configurações do localStorage
        settingsKeys.forEach(key => localStorage.removeItem(key));

        // Redefine configurações no banco de dados
        const db = firebase.firestore();
        const userSettings = db.collection('userSettings').doc(getUserId());
        
        await userSettings.set({
            theme: 'dark',
            notifications: true,
            autoUpdate: true,
            language: 'pt-BR',
            lastReset: firebase.firestore.FieldValue.serverTimestamp()
        });

        return {
            success: true,
            message: 'Configurações redefinidas com sucesso'
        };
    } catch (error) {
        console.error('Erro ao redefinir configurações:', error);
        return {
            success: false,
            message: 'Erro ao redefinir configurações'
        };
    }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    const clearLicenseBtn = document.getElementById('clear-license-btn');
    const clearCacheBtn = document.getElementById('clear-cache-btn');
    const resetSettingsBtn = document.getElementById('reset-settings-btn');
    const confirmationModal = document.getElementById('confirmation-modal');
    const confirmActionBtn = document.getElementById('confirm-action');
    const cancelActionBtn = document.getElementById('cancel-action');

    let currentAction = null;

    // Função para mostrar resultado
    function showResult(elementId, result) {
        const resultElement = document.getElementById(elementId);
        resultElement.textContent = result.message;
        resultElement.className = `result-message ${result.success ? 'success' : 'error'}`;
        resultElement.style.display = 'block';

        setTimeout(() => {
            resultElement.style.display = 'none';
        }, 5000);
    }

    // Função para mostrar modal de confirmação
    function showConfirmationModal(action) {
        currentAction = action;
        confirmationModal.style.display = 'flex';
    }

    // Event listeners para botões
    clearLicenseBtn.addEventListener('click', () => {
        showConfirmationModal('license');
    });

    clearCacheBtn.addEventListener('click', () => {
        showConfirmationModal('cache');
    });

    resetSettingsBtn.addEventListener('click', () => {
        showConfirmationModal('settings');
    });

    // Confirmar ação
    confirmActionBtn.addEventListener('click', async () => {
        let result;
        
        switch (currentAction) {
            case 'license':
                result = await clearLicenseData();
                showResult('clear-license-result', result);
                break;
            case 'cache':
                result = await clearBrowserCache();
                showResult('clear-cache-result', result);
                break;
            case 'settings':
                result = await resetSettings();
                showResult('reset-settings-result', result);
                break;
        }

        confirmationModal.style.display = 'none';
    });

    // Cancelar ação
    cancelActionBtn.addEventListener('click', () => {
        confirmationModal.style.display = 'none';
    });

    // Fechar modal clicando fora
    confirmationModal.addEventListener('click', (e) => {
        if (e.target === confirmationModal) {
            confirmationModal.style.display = 'none';
        }
    });
});
