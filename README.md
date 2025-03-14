# Tela de Login Moderna e Responsiva

Este projeto consiste em uma tela de login moderna, responsiva e segura, desenvolvida para uso em aplicações web profissionais. A interface foi criada seguindo princípios de design centrado no usuário, com foco em usabilidade, acessibilidade e segurança.

## Características

### Funcionalidades Implementadas

- **Formulário de Login Completo**:
  - Campos para usuário/e-mail e senha
  - Opção "Lembrar-me"
  - Link para recuperação de senha
  - Link para cadastro de novo usuário
  
- **Validação de Formulários**:
  - Validação de e-mail
  - Validação de senha
  - Mensagens de erro claras e informativas
  
- **Segurança**:
  - Limitação de tentativas de login (5 tentativas)
  - Bloqueio temporário após tentativas excessivas (10 minutos)
  - Proteção contra ataques de força bruta
  - Validação de força de senha

- **Recursos Adicionais**:
  - Login com redes sociais (Google, Facebook)
  - Recuperação de senha via e-mail
  - Formulário de cadastro de novos usuários
  - Animações e transições suaves
  
- **Design Responsivo**:
  - Adaptação automática para desktop, tablet e dispositivos móveis
  - Layout fluido que se ajusta a diferentes tamanhos de tela

### Considerações de Design

- **Princípios de UX/UI**:
  - Interface limpa e minimalista
  - Foco nos elementos principais
  - Contraste adequado para melhor legibilidade
  - Feedback visual para ações do usuário
  
- **Acessibilidade**:
  - Estrutura semântica de HTML
  - Contraste de cores adequado
  - Navegação por teclado
  - Compatibilidade com leitores de tela
  - Opção para reduzir animações

## Estrutura do Projeto

```
/
├── index.html          # Estrutura HTML da tela de login
├── styles.css          # Estilos CSS e responsividade
├── script.js           # Funcionalidades JavaScript e validações
└── Logo.jpeg           # Logo da empresa (identidade visual)
```

## Guia de Uso

### Usuário de Teste

Para testar a funcionalidade de login, utilize as seguintes credenciais:

- **E-mail**: admin@exemplo.com
- **Senha**: senha123

### Fluxos de Usuário

#### Fluxo de Login Padrão
1. Acesse a página inicial
2. Preencha seu e-mail e senha
3. Clique em "Entrar"
4. Ao fazer login com sucesso, você será redirecionado (simulado por um alerta)

#### Fluxo de Recuperação de Senha
1. Clique no link "Esqueceu a senha?"
2. Digite seu e-mail no formulário de recuperação
3. Clique em "Enviar"
4. Um e-mail de recuperação será enviado (simulado)

#### Fluxo de Cadastro
1. Clique no link "Cadastre-se"
2. Preencha o formulário com seus dados
3. A senha deve ter pelo menos 8 caracteres, incluindo letras maiúsculas, minúsculas e números
4. Clique em "Cadastrar"
5. Um e-mail de confirmação será enviado (simulado)

## Paleta de Cores

A paleta de cores foi escolhida para refletir a identidade visual da empresa, baseando-se no logotipo fornecido:

- **Cor Principal**: #2563eb (Azul)
- **Cor Principal Escura**: #1d4ed8
- **Cor Principal Clara**: #3b82f6
- **Cor Secundária**: #334155 (Cinza escuro)
- **Cor de Destaque**: #f59e0b (Laranja/Amarelo)
- **Cor de Fundo**: #f8fafc (Cinza muito claro)
- **Cor de Erro**: #ef4444 (Vermelho)
- **Cor de Sucesso**: #10b981 (Verde)

## Tecnologias Utilizadas

- **HTML5** - Estrutura da página
- **CSS3** - Estilização e responsividade
  - Flexbox para layouts flexíveis
  - Media queries para responsividade
  - Variáveis CSS para consistência de design
  - Animações e transições
- **JavaScript** - Interatividade e validações
  - Manipulação de DOM
  - Gerenciamento de eventos
  - Validações de formulário
  - LocalStorage para persistência

## Requisitos e Compatibilidade

- Compatível com navegadores modernos: Chrome, Firefox, Safari, Edge
- Design responsivo para dispositivos com largura mínima de 320px
- Não requer bibliotecas ou frameworks externos

## Desenvolvimento Futuro

Possíveis melhorias e expansões para este projeto:

- Implementação de autenticação real com backend
- Integração com sistemas de autenticação OAuth
- Integração com autenticação de dois fatores (2FA)
- Testes de usabilidade com usuários reais
- Personalização de temas (modo escuro/claro)

---

Desenvolvido com ❤️ para [Nome da Empresa] 

# Como Testar a Tela de Login

Para testar a tela de login que desenvolvemos, você precisa seguir estes passos simples:

## Passo 1: Abrir a Aplicação

Existem várias maneiras de abrir a aplicação no seu navegador:

1. **Método direto**: Clique duplo no arquivo `index.html` para abri-lo no seu navegador padrão.

2. **Usando um servidor local**:
   - Instale um servidor local como o Live Server (se estiver usando VSCode)
   - Ou use o Python para criar um servidor simples:
   ```
   python -m http.server
   ```
   - E acesse `http://localhost:8000` no navegador

## Passo 2: Testar o Login

Para testar a funcionalidade de login, use as credenciais de teste:
- **E-mail**: admin@exemplo.com
- **Senha**: senha123

## Passo 3: Testar Outras Funcionalidades

### Teste de Validação de Campos
- Tente deixar campos em branco
- Insira um e-mail inválido (sem @ ou sem domínio)
- Verifique se as mensagens de erro aparecem corretamente

### Teste da Opção "Lembrar-me"
1. Faça login marcando a opção "Lembrar-me"
2. Feche o navegador e abra novamente
3. Verifique se o campo de usuário já está preenchido

### Teste de Recuperação de Senha
1. Clique em "Esqueceu a senha?"
2. Insira um e-mail no modal que aparecer
3. Verifique se a mensagem de confirmação aparece

### Teste de Cadastro
1. Clique em "Cadastre-se"
2. Preencha o formulário de cadastro
3. Teste a validação de senha forte (deve conter maiúsculas, minúsculas e números)
4. Verifique se as senhas coincidem

### Teste de Segurança
1. Tente fazer login com credenciais incorretas várias vezes (5 vezes)
2. Verifique se o sistema bloqueia temporariamente após muitas tentativas

### Teste de Responsividade
- Redimensione a janela do navegador para simular diferentes dispositivos
- Utilize as ferramentas de desenvolvedor do navegador (F12) para testar em resoluções de dispositivos móveis
- Verifique se a interface se adapta adequadamente a diferentes tamanhos de tela

## Observações Importantes

- Esta implementação é apenas para demonstração e não realiza autenticação real
- Em um ambiente de produção, seria necessário conectar esta interface a um backend para processar a autenticação
- As mensagens de sucesso são simuladas com alertas para facilitar a visualização do comportamento

O sistema está configurado para aceitar apenas o login de teste mencionado. Qualquer outra tentativa resultará em erro de autenticação, permitindo testar o comportamento de falha.

Deseja que eu faça alguma alteração ou melhoria no código antes de testar? 