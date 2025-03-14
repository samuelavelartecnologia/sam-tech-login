# Script para realizar push para o GitHub - Versão direta
Write-Host "Iniciando processo de push para o GitHub..." -ForegroundColor Green

try {
    # URL do repositório no GitHub
    $remoteUrl = "https://github.com/samuelavelartecnologia/sam-tech-login.git"
    
    # Definir variáveis de ambiente para evitar paginação no Git
    $env:GIT_PAGER = "cat"
    
    # Passo 1: Configurações do Git
    Write-Host "`n[Passo 1] Configurando o Git..." -ForegroundColor Cyan
    git config --global user.email "samuelavelartecnologia@gmail.com"
    git config --global user.name "Sam's Tech"
    Write-Host "Configurações do Git aplicadas." -ForegroundColor Green
    
    # Passo 2: Inicializar ou verificar repositório Git
    Write-Host "`n[Passo 2] Verificando repositório Git..." -ForegroundColor Cyan
    
    # Verificar se já existe um repositório Git
    if (Test-Path ".git") {
        Write-Host "Repositório Git já existe." -ForegroundColor Yellow
        
        # Renomear branch master para main se necessário
        Write-Host "Tentando renomear branch 'master' para 'main' se existir..." -ForegroundColor Yellow
        git branch -m master main 2>$null
        Write-Host "Operação de renomeação concluída." -ForegroundColor Green
    } else {
        git init
        Write-Host "Repositório Git inicializado." -ForegroundColor Green
        Write-Host "Criando branch 'main'..." -ForegroundColor Yellow
        git checkout -b main
        Write-Host "Branch 'main' criado." -ForegroundColor Green
    }
    
    # Passo 3: Adicionar arquivos
    Write-Host "`n[Passo 3] Adicionando arquivos ao Stage..." -ForegroundColor Cyan
    git add .
    Write-Host "Arquivos adicionados ao Stage." -ForegroundColor Green
    
    # Passo 4: Commit
    Write-Host "`n[Passo 4] Realizando commit..." -ForegroundColor Cyan
    $mensagemCommit = "Primeira versão da tela de login da Sam's Tech"
    git commit -m $mensagemCommit
    Write-Host "Commit realizado com sucesso." -ForegroundColor Green
    
    # Passo 5: Configurar repositório remoto
    Write-Host "`n[Passo 5] Configurando repositório remoto..." -ForegroundColor Cyan
    Write-Host "Usando o repositório: $remoteUrl" -ForegroundColor Yellow
    
    # Remover origin se existir e adicionar novamente
    git remote remove origin 2>$null
    git remote add origin $remoteUrl
    Write-Host "Repositório remoto configurado." -ForegroundColor Green
    
    # Passo 6: Push para o GitHub
    Write-Host "`n[Passo 6] Realizando push para o GitHub (branch: main)..." -ForegroundColor Cyan
    git push -u origin main
    
    # Finalizando
    Write-Host "`nProcesso concluído! Seu código está no GitHub." -ForegroundColor Green
    Write-Host "Acesse $remoteUrl para verificar seu repositório." -ForegroundColor Green
}
catch {
    Write-Host "`nErro: $_" -ForegroundColor Red
    Write-Host "Ocorreu um erro no processo. Tente executar os comandos manualmente." -ForegroundColor Red
}
finally {
    Write-Host "`nPressione qualquer tecla para sair..." -ForegroundColor Yellow
    [void][System.Console]::ReadKey($true)
} 