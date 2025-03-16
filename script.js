// Configuração inicial
document.addEventListener('DOMContentLoaded', () => {
    const licenseForm = document.getElementById('license-key-form');
    const licenseInput = document.getElementById('license-key-input');
    const errorMessage = document.getElementById('license-key-input-error');

    // Função para validar a chave de licença
    async function validateLicenseKey(key) {
        try {
            const db = firebase.firestore();
            const licenseRef = db.collection('licenses').doc(key);
            const doc = await licenseRef.get();

            if (doc.exists) {
                const licenseData = doc.data();
                if (licenseData.isValid && !licenseData.isUsed) {
                    // Marca a licença como usada
                    await licenseRef.update({
                        isUsed: true,
                        usedAt: firebase.firestore.FieldValue.serverTimestamp(),
                        machineId: await getMachineId()
                    });
                    return true;
                }
            }
            return false;
        } catch (error) {
            console.error('Erro ao validar licença:', error);
            return false;
        }
    }

    // Função para obter ID único da máquina
    async function getMachineId() {
        // Implementar lógica para gerar ID único da máquina
        return 'MACHINE_ID_' + Date.now();
    }

    // Handler do formulário
    licenseForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const licenseKey = licenseInput.value.trim();
        
        if (!licenseKey) {
            errorMessage.textContent = 'Por favor, insira uma chave de licença.';
            errorMessage.style.display = 'block';
            return;
        }

        // Desabilita o botão durante a validação
        const submitButton = licenseForm.querySelector('button');
        submitButton.disabled = true;
        submitButton.textContent = 'Validando...';

        try {
            const isValid = await validateLicenseKey(licenseKey);
            
            if (isValid) {
                // Salva a licença localmente
                localStorage.setItem('samsTechLicense', licenseKey);
                
                // Redireciona para a próxima tela ou fecha o modal
                window.location.href = 'dashboard.html';
            } else {
                errorMessage.textContent = 'Chave de licença inválida ou já utilizada.';
                errorMessage.style.display = 'block';
            }
        } catch (error) {
            console.error('Erro:', error);
            errorMessage.textContent = 'Erro ao validar a licença. Tente novamente.';
            errorMessage.style.display = 'block';
        } finally {
            // Reabilita o botão
            submitButton.disabled = false;
            submitButton.textContent = 'Validar Licença';
        }
    });

    // Limpa mensagem de erro quando o usuário começa a digitar
    licenseInput.addEventListener('input', () => {
        errorMessage.style.display = 'none';
    });
});
