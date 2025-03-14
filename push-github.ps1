# Script para realizar push para o GitHub
Write-Host "Iniciando processo de push para o GitHub..." -ForegroundColor Green

# Configurações do Git
git config --global user.email "seu.email@exemplo.com"
git config --global user.name "Sam's Tech"

# Inicializar repositório Git
git init
Write-Host "Repositório Git inicializado." -ForegroundColor Green

# Adicionar arquivos
git add .
Write-Host "Arquivos adicionados ao Stage." -ForegroundColor Green

# Commit
git commit -m "Primeira versão da tela de login da Sam's Tech"
Write-Host "Commit realizado com sucesso." -ForegroundColor Green

# URL do repositório remoto (o usuário precisará configurar isso)
$remoteUrl = Read-Host -Prompt "Digite a URL do seu repositório GitHub (ex: https://github.com/usuario/repositorio.git)"

# Adicionar o repositório remoto
git remote add origin $remoteUrl
Write-Host "Repositório remoto adicionado." -ForegroundColor Green

# Push para o GitHub
git push -u origin master
Write-Host "Push realizado com sucesso!" -ForegroundColor Green

# Finalizando
Write-Host "Processo concluído! Seu código está no GitHub." -ForegroundColor Green
pause 