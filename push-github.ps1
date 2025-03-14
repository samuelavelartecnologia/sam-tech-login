# Script para realizar push para o GitHub
Write-Host "Iniciando processo de push para o GitHub..." -ForegroundColor Green

try {
    # Passo 1: Configurações do Git
    Write-Host "`n[Passo 1] Configurando o Git..." -ForegroundColor Cyan
    git config --global user.email "seu.email@exemplo.com"
    git config --global user.name "Sam's Tech"
    Write-Host "Configurações do Git aplicadas." -ForegroundColor Green
    
    # Passo 2: Inicializar repositório Git
    Write-Host "`n[Passo 2] Inicializando o repositório Git..." -ForegroundColor Cyan
    
    # Verificar se já existe um repositório Git
    if (Test-Path ".git") {
        Write-Host "Repositório Git já existe. Verificando branch atual..." -ForegroundColor Yellow
        
        # Verificar branch atual
        $currentBranch = git branch | Select-String "\*" | ForEach-Object { $_.ToString().Trim('*', ' ') }
        Write-Host "Branch atual: $currentBranch" -ForegroundColor Yellow
        
        # Se estiver no branch master, renomear para main
        if ($currentBranch -eq "master") {
            Write-Host "Renomeando branch de 'master' para 'main'..." -ForegroundColor Yellow
            git branch -m master main
            Write-Host "Branch renomeado com sucesso." -ForegroundColor Green
        }
    } else {
        git init -b main
        Write-Host "Repositório Git inicializado com branch 'main'." -ForegroundColor Green
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
    Write-Host "Antes de continuar, você precisa criar um repositório no GitHub." -ForegroundColor Yellow
    Write-Host "Acesse github.com, faça login, e crie um novo repositório." -ForegroundColor Yellow
    Write-Host "NÃO inicialize o repositório com README, .gitignore ou licença." -ForegroundColor Yellow
    Write-Host "Após criar o repositório, copie a URL e cole abaixo." -ForegroundColor Yellow
    $remoteUrl = Read-Host -Prompt "Digite a URL do seu repositório GitHub (ex: https://github.com/usuario/repositorio.git)"
    
    # Verificar se já existe um remote chamado origin
    $remoteExists = git remote -v | Select-String -Pattern "origin"
    
    if ($remoteExists) {
        Write-Host "Remote 'origin' já existe. Atualizando URL..." -ForegroundColor Yellow
        git remote set-url origin $remoteUrl
    } else {
        git remote add origin $remoteUrl
    }
    
    Write-Host "Repositório remoto configurado." -ForegroundColor Green
    
    # Usar explicitamente o branch 'main'
    $branchName = "main"
    
    # Passo 6: Push para o GitHub
    Write-Host "`n[Passo 6] Realizando push para o GitHub (branch: $branchName)..." -ForegroundColor Cyan
    git push -u origin $branchName
    
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