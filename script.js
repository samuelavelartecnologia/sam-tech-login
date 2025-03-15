document.addEventListener('DOMContentLoaded', function() {
    // Elementos do DOM
    const loginForm = document.getElementById('login-form');
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
    const registerForm = document.getElementById('register-form');
    const licenseKeyForm = document.getElementById('license-key-form');
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
    loginForm.addEventListener('submit', function(e) {
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
        
        // Simulação de autenticação
        // Em um ambiente real, isso seria substituído por uma chamada API
        authenticateUser(username, password);
    });
    
    // Autenticação do usuário (primeira etapa)
    function authenticateUser(username, password) {
        // Simulando um delay de rede
        const loginButton = document.querySelector('.btn-login');
        const originalButtonText = loginButton.innerHTML;
        
        loginButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Entrando...';
        loginButton.disabled = true;
        
        setTimeout(() => {
            // Verificando credenciais registradas no localStorage
            let isAuthenticated = false;
            let userData = null;
            
            // Verificar usuário e senha padrão para testes
            if ((username === 'admin@exemplo.com' && password === 'senha123') || 
                (username === 'samuelavelarbr@gmail.com' && password === '1234')) {
                isAuthenticated = true;
                userData = {
                    empresa: username === 'samuelavelarbr@gmail.com' ? 'Sam Tech' : 'Sam Tech Demo',
                    email: username
                };
            } else {
                // Buscar usuários cadastrados
                const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
                
                // Procurar o usuário pelo email
                const userFound = registeredUsers.find(user => user.email === username);
                
                // Verificar se o usuário existe e se a senha corresponde
                if (userFound && userFound.password === password) {
                    isAuthenticated = true;
                    userData = userFound;
                }
            }
            
            if (isAuthenticated) {
                // Login bem-sucedido, agora pede a licença
                tempCredentials = userData; // Armazena as credenciais para uso posterior
                
                loginButton.innerHTML = originalButtonText;
                loginButton.disabled = false;
                
                // Primeiro mostra mensagem de login bem-sucedido
                alert('Login realizado com sucesso! Agora insira sua chave de licença.');
                
                // Abre o modal para inserção da chave de licença
                openModal(licenseKeyModal);
            } else {
                // Login falhou
                loginFailed();
                loginButton.innerHTML = originalButtonText;
                loginButton.disabled = false;
            }
        }, 1500);
    }
    
    // Validação da chave de licença (segunda etapa)
    licenseKeyForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const licenseKey = document.getElementById('license-key-input').value.trim();
        
        if (licenseKey === '') {
            showError('license-key-input-error', 'Por favor, digite sua chave de licença.');
            return;
        }
        
        // Simula verificação da licença
        validateLicense(licenseKey);
    });
    
    // Validação da licença
    function validateLicense(licenseKey) {
        // Simulando um delay de rede
        const validateButton = licenseKeyForm.querySelector('button');
        const originalButtonText = validateButton.innerHTML;
        
        validateButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Validando...';
        validateButton.disabled = true;
        
        setTimeout(() => {
            let licenseValid = false;
            let licenseData = null;
            
            // Verifica se é a licença de demonstração
            if (tempCredentials.email === 'admin@exemplo.com' && licenseKey === 'DEMO-1234-5678-9ABC') {
                licenseValid = true;
                licenseData = {
                    chave: 'DEMO-1234-5678-9ABC',
                    expira: new Date().getTime() + (30 * 24 * 60 * 60 * 1000), // 30 dias
                    status: 'ativa'
                };
            } 
            // Verifica se é a licença do usuário Samuel
            else if (tempCredentials.email === 'samuelavelarbr@gmail.com' && licenseKey === 'desenvolvedor') {
                licenseValid = true;
                licenseData = {
                    chave: 'desenvolvedor',
                    expira: new Date().getTime() + (365 * 24 * 60 * 60 * 1000), // 1 ano
                    status: 'ativa'
                };
            }
            else {
                // Verificar licença real
                // Aqui seria uma chamada a API ou verificação no banco de dados
                
                // Simulando uma licença válida para teste
                if (licenseKey.match(/^[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/)) {
                    licenseValid = true;
                    licenseData = {
                        chave: licenseKey,
                        expira: new Date().getTime() + (15 * 24 * 60 * 60 * 1000), // 15 dias
                        status: 'ativa'
                    };
                }
            }
            
            if (licenseValid) {
                // Atualiza os dados do usuário com as informações da licença
                const userData = tempCredentials;
                userData.licenca = licenseData;
                
                // Login completo bem-sucedido
                loginSuccessful(userData);
                closeModal(licenseKeyModal);
            } else {
                showError('license-key-input-error', 'Chave de licença inválida. Verifique e tente novamente.');
                validateButton.innerHTML = originalButtonText;
                validateButton.disabled = false;
            }
        }, 1500);
    }
    
    // Ação de login bem-sucedido
    function loginSuccessful(userData) {
        // Reseta contagem de tentativas
        loginAttempts = 0;
        
        // Salvar no localStorage se "lembrar-me" estiver marcado
        const rememberMe = document.getElementById('remember').checked;
        if (rememberMe) {
            localStorage.setItem('rememberedUser', usernameInput.value);
        } else {
            localStorage.removeItem('rememberedUser');
        }
        
        // Salvar token de autorização
        const authToken = generateAuthToken();
        localStorage.setItem('authToken', authToken);
        
        // Armazenar informações da licença na sessão
        sessionStorage.setItem('currentUser', JSON.stringify(userData));
        
        // Exibir informações da licença
        updateLicenseInfo(userData);
        openModal(licenseStatusModal);
        
        // Configurar temporizador para exibir o dashboard após mostrar o status da licença
        setTimeout(() => {
            alert('Redirecionando para o dashboard...');
            // Em um caso real:
            // window.location.href = 'dashboard.html';
        }, 5000);
    }
    
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
    
    // Validação do formulário de registro
    registerForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Limpa mensagens de erro anteriores
        clearErrors();
        
        const companyName = document.getElementById('register-name').value.trim();
        const phone = document.getElementById('register-phone').value.trim();
        const email = document.getElementById('register-email').value.trim();
        const password = document.getElementById('register-password').value;
        const confirmPassword = document.getElementById('register-confirm-password').value;
        
        // Validação do nome da empresa
        if (companyName === '') {
            showError('register-name-error', 'Por favor, digite o nome da empresa.');
            return;
        }
        
        // Validação do telefone
        if (phone === '') {
            showError('register-phone-error', 'Por favor, digite um telefone de contato.');
            return;
        }
        
        // Validação do email
        if (!isValidEmail(email)) {
            showError('register-email-error', 'Por favor, insira um e-mail válido.');
            return;
        }
        
        // Verificar se o email já está em uso
        const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
        if (registeredUsers.some(user => user.email === email)) {
            showError('register-email-error', 'Este e-mail já está em uso.');
            return;
        }
        
        // Validação da senha
        if (!isStrongPassword(password)) {
            showError('register-password-error', 'A senha deve ter pelo menos 8 caracteres, incluindo maiúsculas, minúsculas, números e caracteres especiais.');
            return;
        }
        
        // Validação da confirmação de senha
        if (password !== confirmPassword) {
            showError('register-confirm-password-error', 'As senhas não correspondem.');
            return;
        }
        
        // Simulação de registro (salvar no localStorage)
        const registerButton = this.querySelector('button');
        const originalButtonText = registerButton.textContent;
        
        registerButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Cadastrando...';
        registerButton.disabled = true;
        
        setTimeout(() => {
            // Criar novo usuário
            const newUser = {
                empresa: companyName,
                telefone: phone,
                email: email,
                password: password, // Em uma aplicação real, isto seria um hash seguro
                licenca: null,
                status: "pendente"
            };
            
            // Adicionar à lista de usuários cadastrados
            registeredUsers.push(newUser);
            localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
            
            alert('Cadastro realizado com sucesso! Aguarde a ativação da sua licença.');
            closeModal(registerModal);
            
            // Limpar formulário
            registerForm.reset();
            
            registerButton.textContent = originalButtonText;
            registerButton.disabled = false;
        }, 1500);
    });
    
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