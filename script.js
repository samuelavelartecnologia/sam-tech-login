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
    const recoveryForm = document.getElementById('recovery-form');
    const registerForm = document.getElementById('register-form');
    const closeModalButtons = document.querySelectorAll('.close-modal');
    const togglePasswordButtons = document.querySelectorAll('.toggle-password');
    
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
        simulateAuthentication(username, password);
    });
    
    // Simulação de autenticação (para demonstração)
    function simulateAuthentication(username, password) {
        // Simulando um delay de rede
        const loginButton = document.querySelector('.btn-login');
        const originalButtonText = loginButton.innerHTML;
        
        loginButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Entrando...';
        loginButton.disabled = true;
        
        setTimeout(() => {
            // Verificando credenciais registradas no localStorage
            let isAuthenticated = false;
            
            // Verificar usuário e senha padrão para testes
            if (username === 'admin@exemplo.com' && password === 'senha123') {
                isAuthenticated = true;
            } else {
                // Buscar usuários cadastrados
                const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
                
                // Procurar o usuário pelo email
                const userFound = registeredUsers.find(user => user.email === username);
                
                // Verificar se o usuário existe e se a senha corresponde
                if (userFound && userFound.password === password) {
                    isAuthenticated = true;
                }
            }
            
            if (isAuthenticated) {
                // Login bem-sucedido
                loginSuccessful();
            } else {
                // Login falhou
                loginFailed();
            }
            
            loginButton.innerHTML = originalButtonText;
            loginButton.disabled = false;
        }, 1500);
    }
    
    // Ação de login bem-sucedido
    function loginSuccessful() {
        // Reseta contagem de tentativas
        loginAttempts = 0;
        
        // Salvar no localStorage se "lembrar-me" estiver marcado
        const rememberMe = document.getElementById('remember').checked;
        if (rememberMe) {
            localStorage.setItem('rememberedUser', usernameInput.value);
        } else {
            localStorage.removeItem('rememberedUser');
        }
        
        // Redirect para a página principal (na demonstração, apenas um alerta)
        alert('Login realizado com sucesso! Redirecionando...');
        
        // Em um caso real:
        // window.location.href = 'dashboard.html';
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
        // Removendo validação complexa, apenas verificando se a senha não está vazia
        return password.length > 0;
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
    
    // Fechar modal ao clicar fora
    window.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal')) {
            closeModal(e.target);
        }
    });
    
    // Função para abrir modal
    function openModal(modal) {
        modal.style.display = 'flex';
        // Anima entrada
        setTimeout(() => {
            modal.querySelector('.modal-content').style.transform = 'scale(1)';
            modal.querySelector('.modal-content').style.opacity = '1';
        }, 10);
    }
    
    // Função para fechar modal
    function closeModal(modal) {
        modal.querySelector('.modal-content').style.transform = 'scale(0.8)';
        modal.querySelector('.modal-content').style.opacity = '0';
        setTimeout(() => {
            modal.style.display = 'none';
        }, 300);
    }
    
    // Validação do formulário de recuperação de senha
    recoveryForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const recoveryEmail = document.getElementById('recovery-email').value.trim();
        
        // Validação básica
        if (!isValidEmail(recoveryEmail)) {
            showError('recovery-email-error', 'Por favor, digite um e-mail válido.');
            return;
        }
        
        // Simulação de envio de e-mail de recuperação
        const submitButton = this.querySelector('button');
        const originalText = submitButton.textContent;
        
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
        submitButton.disabled = true;
        
        setTimeout(() => {
            // Simulação de sucesso
            alert(`Um e-mail de recuperação foi enviado para ${recoveryEmail}. Verifique sua caixa de entrada.`);
            closeModal(passwordRecoveryModal);
            submitButton.textContent = originalText;
            submitButton.disabled = false;
            this.reset();
        }, 1500);
    });
    
    // Validação do formulário de registro
    registerForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Limpa mensagens de erro anteriores
        clearErrors();
        
        // Obtenção dos valores
        const name = document.getElementById('register-name').value.trim();
        const email = document.getElementById('register-email').value.trim();
        const password = document.getElementById('register-password').value;
        const confirmPassword = document.getElementById('register-confirm-password').value;
        
        // Validações
        let isValid = true;
        
        if (name === '') {
            showError('register-name-error', 'Por favor, digite o nome da sua empresa.');
            isValid = false;
        }
        
        if (!isValidEmail(email)) {
            showError('register-email-error', 'Por favor, digite um e-mail válido.');
            isValid = false;
        }
        
        if (password === '') {
            showError('register-password-error', 'Por favor, digite uma senha.');
            isValid = false;
        }
        
        if (password !== confirmPassword) {
            showError('register-confirm-password-error', 'As senhas não coincidem.');
            isValid = false;
        }
        
        if (isValid) {
            // Verificar se o email já está cadastrado
            const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
            if (registeredUsers.some(user => user.email === email)) {
                showError('register-email-error', 'Este e-mail já está cadastrado.');
                return;
            }
            
            // Simulação de registro
            const submitButton = this.querySelector('button');
            const originalText = submitButton.textContent;
            
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Cadastrando...';
            submitButton.disabled = true;
            
            setTimeout(() => {
                // Salvar os dados do usuário no localStorage
                registeredUsers.push({
                    name: name,
                    email: email,
                    password: password,
                    registeredAt: new Date().toISOString()
                });
                localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
                
                // Simulação de sucesso
                alert(`Conta criada com sucesso! Um e-mail de confirmação foi enviado para ${email}.`);
                closeModal(registerModal);
                submitButton.textContent = originalText;
                submitButton.disabled = false;
                this.reset();
                
                // Preencher automaticamente o campo de email no login
                document.getElementById('username').value = email;
            }, 1500);
        }
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
        document.querySelectorAll('.modal-content').forEach(content => {
            content.style.transition = 'all 0.3s ease';
            content.style.transform = 'scale(0.8)';
            content.style.opacity = '0';
        });
    }
    
    // Inicialização
    checkRememberedUser();
    initializeModals();
}); 