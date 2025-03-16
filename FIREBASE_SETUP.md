# Configuração do Firebase - Sam's Tech

## Passo a Passo para Configuração

### 1. Criar Projeto no Firebase

1. Acesse o [Console do Firebase](https://console.firebase.google.com/)
2. Clique em "Adicionar Projeto"
3. Digite o nome "sam-tech-login"
4. Siga as instruções para criar o projeto

### 2. Configurar Autenticação

1. No menu lateral, clique em "Authentication"
2. Ative os seguintes métodos de autenticação:
   - E-mail/Senha
   - Google (opcional)

### 3. Configurar Firestore

1. No menu lateral, clique em "Firestore Database"
2. Crie um novo banco de dados
3. Comece no modo de teste
4. Configure as regras de segurança:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Regras para coleção de licenças
    match /licenses/{licenseId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.isAdmin == true;
    }
    
    // Regras para usuários
    match /users/{userId} {
      allow read: if request.auth != null && request.auth.uid == userId;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

### 4. Estrutura do Banco de Dados

#### Coleção: licenses
```javascript
{
  "licenseKey": {
    isValid: boolean,
    isUsed: boolean,
    createdAt: timestamp,
    expiresAt: timestamp,
    duration: number,
    machineId: string,
    usedAt: timestamp
  }
}
```

#### Coleção: users
```javascript
{
  "userId": {
    email: string,
    name: string,
    isAdmin: boolean,
    createdAt: timestamp,
    lastLogin: timestamp,
    settings: {
      theme: string,
      notifications: boolean,
      language: string
    }
  }
}
```

### 5. Configurar o Arquivo firebase-config.js

1. No console do Firebase, vá para Configurações do Projeto
2. Na seção "Seus aplicativos", clique no ícone da Web
3. Registre o app e copie as configurações
4. Cole as configurações no arquivo `firebase-config.js`

### 6. Índices Necessários

Crie os seguintes índices compostos:

1. Coleção: licenses
   - Campos: isValid (Ascending), createdAt (Descending)
   - Campos: isUsed (Ascending), expiresAt (Ascending)

### 7. Variáveis de Ambiente

Configure as seguintes variáveis de ambiente no seu servidor:

```bash
FIREBASE_API_KEY=sua-api-key
FIREBASE_AUTH_DOMAIN=seu-auth-domain
FIREBASE_PROJECT_ID=seu-project-id
FIREBASE_STORAGE_BUCKET=seu-storage-bucket
FIREBASE_MESSAGING_SENDER_ID=seu-sender-id
FIREBASE_APP_ID=seu-app-id
```

### 8. Testes

Execute os seguintes testes para verificar a configuração:

1. Criar uma licença de teste
2. Validar a licença
3. Verificar o status da licença
4. Testar a revogação da licença

### 9. Backup e Recuperação

Configure backups automáticos:

1. Ative o Export/Import no Console do Firebase
2. Configure a periodicidade dos backups
3. Defina o local de armazenamento dos backups

### 10. Monitoramento

Ative o monitoramento do Firebase:

1. Configure alertas de uso
2. Monitore o desempenho
3. Ative logs de depuração

## Suporte

Em caso de dúvidas ou problemas:
- E-mail: suporte@samstech.com.br
- WhatsApp: (XX) XXXXX-XXXX
