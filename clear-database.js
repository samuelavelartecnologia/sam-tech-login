async function limparBancoDeDados() {
    try {
        // Limpar coleção de usuários
        const usuarios = await db.collection('users').get();
        const batch = db.batch();
        
        usuarios.forEach((doc) => {
            batch.delete(doc.ref);
        });

        // Limpar coleção de licenças
        const licencas = await db.collection('licenses').get();
        licencas.forEach((doc) => {
            batch.delete(doc.ref);
        });

        await batch.commit();
        console.log('Banco de dados limpo com sucesso!');
        
    } catch (error) {
        console.error('Erro ao limpar banco de dados:', error);
    }
}

// Execute a função
limparBancoDeDados();