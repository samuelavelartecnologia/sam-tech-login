# Configuração do Firebase para o Sistema de Licenciamento

Este documento apresenta as etapas necessárias para configurar o Firebase para o sistema de licenciamento do SamTech Bot.

## 1. Criar projeto no Firebase

1. Acesse o [Console do Firebase](https://console.firebase.google.com/)
2. Clique em "Adicionar projeto"
3. Dê um nome ao projeto (ex: "SamTech Bot")
4. Siga as instruções para criar o projeto

## 2. Configurar Autenticação

1. No console do Firebase, navegue até "Authentication"
2. Clique em "Começar"
3. Ative o provedor de autenticação "E-mail/senha"
4. Salve as alterações

## 3. Configurar Firestore Database

1. No console do Firebase, navegue até "Firestore Database"
2. Clique em "Criar banco de dados"
3. Escolha "Iniciar no modo de produção"
4. Selecione a região mais próxima (ex: "southamerica-east1")
5. Aguarde a criação do banco de dados

## 4. Criar coleções no Firestore

Você precisará criar as seguintes coleções:

### Coleção "usuarios"
Documentos contendo:
- email (string)
- empresa (string)
- telefone (string)
- dataCriacao (timestamp)
- ultimoLogin (timestamp)

### Coleção "licencas"
Documentos contendo:
- chave (string)
- status (string): "ativa", "expirada", "cancelada"
- tipo (string): "mensal", "anual", "demo", etc.
- expiraEm (timestamp)
- usuarioId (string, referência ao ID do documento do usuário)
- dataAtivacao (timestamp)

## 5. Obter credenciais do Firebase

1. No console do Firebase, navegue até "Configurações do projeto" (ícone de engrenagem)
2. Selecione "Configurações gerais"
3. Role até "Seus aplicativos" e clique em "Adicionar app"
4. Selecione a plataforma "Web"
5. Registre o app com um apelido (ex: "SamTech Bot Web")
6. Copie as configurações do Firebase mostradas

## 6. Atualizar arquivo de configuração

Substitua as credenciais de amostra no arquivo `firebase-config.js` pelas credenciais reais:

```javascript
const firebaseConfig = {
  apiKey: "SUA_API_KEY",
  authDomain: "seu-projeto.firebaseapp.com",
  projectId: "seu-projeto",
  storageBucket: "seu-projeto.appspot.com",
  messagingSenderId: "XXXXXXXXXX",
  appId: "1:XXXXXXXXXXXX:web:XXXXXXXXXXXX"
};
```

## 7. Configurar regras de segurança do Firestore

Navegue até "Firestore Database" > "Regras" e configure regras básicas de segurança:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /usuarios/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      allow create: if request.auth != null;
    }
    match /licencas/{licenseId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.token.admin == true;
    }
  }
}
```

## Próximos passos

Depois de configurar o Firebase, você poderá:

1. Criar usuários de teste através do painel "Authentication"
2. Adicionar licenças de teste na coleção "licencas"
3. Testar o fluxo completo de login e validação de licença
