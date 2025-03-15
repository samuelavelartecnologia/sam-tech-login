// Importar módulos do Firebase
import { firebaseAuth, licenseManager } from './firebase-config.js';

document.addEventListener('DOMContentLoaded', function() {
    // Elementos do DOM
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const licenseKeyForm = document.getElementById('license-key-form');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const togglePassword = document.getElementById('toggle-password');
    const loginFailedMessage = document.getElementById('login-failed');
    const forgotPasswordLink = document.getElementById('forgot-password');
    const registerLink = document.getElementById('register-link');
    const passwordRecoveryModal = document.getElementById('password-recovery-modal');
    const registerModal = document.getElementById('register-modal');
    const licenseKeyModal = document.getElementById('license-key-modal');
    const licenseStatusModal = document.getElementById('license-status-modal');
    const recoveryForm = document.getElementById('recovery-form');
    const closeModalButtons = document.querySelectorAll('.close-modal');
    const togglePasswordButtons = document.querySelectorAll('.toggle-password');
    
    // Elementos do status da licença
    const licenseStatusBadge = document.getElementById('license-status-badge');
    const licenseCompany = document.getElementById('license-company');
    const licenseKeyDisplay = document.getElementById('license-key-display');
    const licenseExpiry = document.getElementById('license-expiry');
    const licenseProgress = document.getElementById('license-progress');
    const licenseDaysRemaining = document.getElementById('license-days-remaining');
    
    // Armazenar credenciais temporariamente
    let tempCredentials = null;
    
    // Contador de tentativas de login
    let loginAttempts = 0;
    const maxLoginAttempts = 5;
    let lockoutTime = null;
    
    // Validação de formulário de login
    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Limpa mensagens de erro anteriores
        clearErrors();
        
        // Verifica se está bloqueado por tentativas excessivas
        if (lockoutTime && new Date() < lockoutTime) {
            const remainingMinutes = Math.ceil((lockoutTime - new Date()) / (1000 * 60));
            showError('username-error', `Conta temporariamente bloqueada. Tente novamente em ${remainingMinutes} minutos.`);
            return;
        }
        
        // Validação do nome de usuário/email
        const username = usernameInput.value.trim();
        if (username === '') {
            showError('username-error', 'Por favor, digite seu usuário ou e-mail.');
            return;
        } else if (username.includes('@') && !isValidEmail(username)) {
            showError('username-error', 'E-mail inválido. Verifique o formato.');
            return;
        }
        
        // Validação da senha
        const password = passwordInput.value;
        if (password === '') {
            showError('password-error', 'Por favor, digite sua senha.');
            return;
        }
        
        try {
            const result = await firebaseAuth.loginUsuario(username, password);
            
            if (result.success) {
                // Armazena dados do usuário temporariamente
                window.currentUser = result.user;
                window.userData = result.userData;
                
                // Abre modal para inserção da chave de licença
                openModal(licenseKeyModal);
            } else {
                showError('username-error', result.error);
            }
        } catch (error) {
            showError('username-error', 'Erro ao fazer login: ' + error.message);
        }
    });
    
    // Validação da chave de licença (segunda etapa)
    licenseKeyForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const licenseKey = document.getElementById('license-key-input').value.trim();
        
        if (licenseKey === '') {
            showError('license-key-input-error', 'Por favor, digite sua chave de licença.');
            return;
        }
        
        try {
            const result = await licenseManager.verificarLicenca(licenseKey, window.currentUser.uid);
            
            if (result.success) {
                alert('Licença validada com sucesso!');
                // Aqui você pode redirecionar para a página principal ou fazer outras ações necessárias
                window.location.href = 'dashboard.html'; // ou outra página
            } else {
                showError('license-key-input-error', result.error);
            }
        } catch (error) {
            showError('license-key-input-error', 'Erro ao validar licença: ' + error.message);
        }
    });
    
    // Registro de novo usuário
    registerForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const empresa = document.getElementById('register-name').value;
        const telefone = document.getElementById('register-phone').value;
        const email = document.getElementById('register-email').value;
        const password = document.getElementById('register-password').value;
        const confirmPassword = document.getElementById('register-confirm-password').value;
        
        // Validações básicas
        if (password !== confirmPassword) {
            showError('register-password-error', 'As senhas não coincidem');
            return;
        }
        
        try {
            const result = await firebaseAuth.registrarUsuario(email, password, {
                empresa: empresa,
                telefone: telefone
            });
            
            if (result.success) {
                alert('Cadastro realizado com sucesso! Por favor, faça login.');
                closeModal(registerModal);
                clearForm(registerForm);
            } else {
                showError('register-email-error', result.error);
            }
        } catch (error) {
            showError('register-email-error', 'Erro ao criar conta: ' + error.message);
        }
    });
    
    // Ação de login falhou
    function loginFailed() {
        loginAttempts++;
        
        // Exibe mensagem de erro
        loginFailedMessage.style.display = 'flex';
        
        // Verifica se atingiu o número máximo de tentativas
        if (loginAttempts >= maxLoginAttempts) {
            // Bloqueio temporário (10 minutos)
            const lockoutDuration = 10 * 60 * 1000; // 10 minutos em milissegundos
            lockoutTime = new Date(new Date().getTime() + lockoutDuration);
            
            showError('username-error', `Muitas tentativas incorretas. Conta bloqueada por 10 minutos.`);
            
            // Reset após o tempo de bloqueio
            setTimeout(() => {
                lockoutTime = null;
                loginAttempts = 0;
            }, lockoutDuration);
        }
    }
    
    // Atualiza informações da licença na interface
    function updateLicenseInfo(userData) {
        if (!userData || !userData.licenca) return;
        
        // Atualizar nome da empresa
        if (userData.empresa) {
            licenseCompany.innerHTML = `Empresa: <span>${userData.empresa}</span>`;
        }
        
        // Atualizar chave de licença (mostrando apenas últimos 4 caracteres)
        const licenseKey = userData.licenca.chave;
        const maskedKey = licenseKey.substring(0, licenseKey.length - 4).replace(/./g, '•') + 
                         licenseKey.substring(licenseKey.length - 4);
        licenseKeyDisplay.textContent = maskedKey;
        
        // Atualizar status
        licenseStatusBadge.textContent = userData.licenca.status === 'ativa' ? 'Ativa' : 'Inativa';
        licenseStatusBadge.className = 'status-badge ' + 
            (userData.licenca.status === 'ativa' ? 'active' : 'expired');
        
        // Calcular e exibir data de expiração
        const expiryDate = new Date(userData.licenca.expira);
        licenseExpiry.textContent = expiryDate.toLocaleDateString('pt-BR');
        
        // Calcular dias restantes
        const today = new Date();
        const diffTime = expiryDate - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        // Definir classe baseada nos dias restantes
        if (diffDays <= 0) {
            licenseStatusBadge.textContent = 'Expirada';
            licenseStatusBadge.className = 'status-badge expired';
            licenseDaysRemaining.textContent = 'Licença expirada';
            licenseProgress.style.width = '0%';
        } else if (diffDays <= 5) {
            licenseStatusBadge.textContent = 'Expirando';
            licenseStatusBadge.className = 'status-badge warning';
            licenseDaysRemaining.textContent = `${diffDays} dia${diffDays > 1 ? 's' : ''} restante${diffDays > 1 ? 's' : ''}`;
            licenseProgress.style.width = (diffDays / 30 * 100) + '%'; // Assumindo licença de 30 dias
        } else {
            licenseDaysRemaining.textContent = `${diffDays} dias restantes`;
            licenseProgress.style.width = (diffDays / 30 * 100) + '%'; // Assumindo licença de 30 dias
        }
    }
    
    // Gerar token de autorização
    function generateAuthToken() {
        // Na implementação real, isso seria substituído por JWT ou outro sistema de tokens
        const randomToken = Math.random().toString(36).substring(2) + Date.now().toString(36);
        return randomToken;
    }
    
    // Exibir mensagem de erro
    function showError(elementId, message) {
        const errorElement = document.getElementById(elementId);
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }
    
    // Limpar mensagens de erro
    function clearErrors() {
        const errorMessages = document.querySelectorAll('.error-message');
        errorMessages.forEach(el => el.style.display = 'none');
        loginFailedMessage.style.display = 'none';
    }
    
    // Validação de e-mail
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    // Validação de força de senha
    function isStrongPassword(password) {
        // Implementação mais robusta
        if (password.length < 8) return false;
        
        // Deve conter pelo menos uma letra maiúscula, uma minúscula, um número e um caractere especial
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumbers = /\d/.test(password);
        const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
        
        return hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar;
    }
    
    // Alternância de visibilidade da senha
    togglePasswordButtons.forEach(button => {
        button.addEventListener('click', function() {
            const input = this.previousElementSibling;
            const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
            input.setAttribute('type', type);
            
            // Altera o ícone
            this.classList.toggle('fa-eye');
            this.classList.toggle('fa-eye-slash');
        });
    });
    
    // Manipulação do modal de recuperação de senha
    forgotPasswordLink.addEventListener('click', function(e) {
        e.preventDefault();
        openModal(passwordRecoveryModal);
    });
    
    // Manipulação do modal de registro
    registerLink.addEventListener('click', function(e) {
        e.preventDefault();
        openModal(registerModal);
    });
    
    // Fechar modais
    closeModalButtons.forEach(button => {
        button.addEventListener('click', function() {
            const modal = this.closest('.modal');
            closeModal(modal);
        });
    });
    
    // Clicar fora do modal também fecha
    window.addEventListener('click', function(e) {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            if (e.target === modal) {
                closeModal(modal);
            }
        });
    });
    
    // Função para abrir modal
    function openModal(modal) {
        modal.style.display = 'flex';
        // Adiciona a classe show após um pequeno delay para permitir a animação
        setTimeout(() => {
            modal.classList.add('show');
        }, 10);
        document.body.style.overflow = 'hidden'; // Impede rolagem da página
    }
    
    // Função para fechar modal
    function closeModal(modal) {
        modal.classList.remove('show');
        // Aguarda a animação terminar antes de esconder o modal
        setTimeout(() => {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto'; // Restaura rolagem da página
        }, 300);
    }
    
    // Validação do formulário de recuperação de senha
    recoveryForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const recoveryEmail = document.getElementById('recovery-email').value.trim();
        
        // Validação do email
        if (!isValidEmail(recoveryEmail)) {
            showError('recovery-email-error', 'Por favor, insira um e-mail válido.');
            return;
        }
        
        // Simulação de envio de email de recuperação
        const recoveryButton = this.querySelector('button');
        const originalButtonText = recoveryButton.textContent;
        
        recoveryButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
        recoveryButton.disabled = true;
        
        setTimeout(() => {
            alert(`Um e-mail de recuperação foi enviado para ${recoveryEmail}. Por favor, verifique sua caixa de entrada.`);
            closeModal(passwordRecoveryModal);
            
            recoveryButton.textContent = originalButtonText;
            recoveryButton.disabled = false;
        }, 1500);
    });
    
    // Funções auxiliares
    function clearForm(form) {
        form.reset();
        const errorMessages = form.getElementsByClassName('error-message');
        for (let error of errorMessages) {
            error.textContent = '';
            error.style.display = 'none';
        }
    }
    
    // Verificar se há um usuário "lembrado"
    function checkRememberedUser() {
        const rememberedUser = localStorage.getItem('rememberedUser');
        if (rememberedUser) {
            usernameInput.value = rememberedUser;
            document.getElementById('remember').checked = true;
        }
    }
    
    // Adicionar estilo extra aos modais
    function initializeModals() {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            modal.style.display = 'none'; // Garante que os modais estejam escondidos inicialmente
        });
    }
    
    // Inicialização
    checkRememberedUser();
    initializeModals();
});