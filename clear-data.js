// Script para limpar os dados do localStorage
localStorage.removeItem('registeredUsers');
localStorage.removeItem('licenseData');
localStorage.removeItem('userStatus');
localStorage.removeItem('currentUser');

// Confirmação visual
alert('Banco de dados local foi limpo com sucesso! Você pode cadastrar novamente usando os mesmos dados.');

// Redirecionar para a página de login
window.location.href = 'index.html';
