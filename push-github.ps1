# Script para automatizar o push para o GitHub
# Autor: Sam's Tech
# Data: 2025-03-15

# Configurações
$REPO_PATH = "e:\ChatBot\ChatBot\Backup_Completo_2025-03-09\ProjetoBot\instalador\dist\Dependencias\loguin\sam-tech-login"
$BRANCH = "main"
$COMMIT_MESSAGE = "feat: Atualização da tela de licença"

# Cores para mensagens
$GREEN = [System.ConsoleColor]::Green
$RED = [System.ConsoleColor]::Red
$YELLOW = [System.ConsoleColor]::Yellow

# Função para exibir mensagens coloridas
function Write-ColorMessage {
    param(
        [string]$Message,
        [System.ConsoleColor]$Color
    )
    Write-Host $Message -ForegroundColor $Color
}

# Navega até o diretório do repositório
Set-Location $REPO_PATH

# Verifica status do Git
Write-ColorMessage "Verificando status do Git..." $YELLOW
git status

# Adiciona todas as alterações
Write-ColorMessage "Adicionando alterações..." $YELLOW
git add .

# Cria o commit
Write-ColorMessage "Criando commit..." $YELLOW
git commit -m $COMMIT_MESSAGE

# Faz o push para o GitHub
Write-ColorMessage "Fazendo push para o GitHub..." $YELLOW
git push origin $BRANCH

# Verifica se houve erro
if ($LASTEXITCODE -eq 0) {
    Write-ColorMessage "Push realizado com sucesso!" $GREEN
} else {
    Write-ColorMessage "Erro ao fazer push. Verifique as mensagens acima." $RED
}

# Aguarda input do usuário antes de fechar
Write-Host "`nPressione qualquer tecla para sair..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
