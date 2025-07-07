# Script pour tuer les processus sur les ports 3000, 3001, 3002 et 3003
Write-Host "Recherche des processus écoutant sur les ports 3000, 3001, 3002 et 3003..." -ForegroundColor Cyan

# Tableau des ports à vérifier
$ports = @(3000, 3001, 3002, 3003, 3004, 3005, 3006)

# Parcourir chaque port
foreach ($port in $ports) {
    Write-Host "`nRecherche des processus sur le port $port..." -ForegroundColor Yellow
    
    # Récupérer les PIDs des processus utilisant ce port
    $processes = netstat -ano | findstr ":$port" | ForEach-Object {
        if ($_ -match ":$port\s+.*LISTENING\s+(\d+)") {
            return $matches[1]
        }
    } | Sort-Object -Unique
    
    # Si des processus sont trouvés, les tuer
    if ($processes) {
        foreach ($processId in $processes) {
            try {
                $processName = (Get-Process -Id $processId -ErrorAction SilentlyContinue).ProcessName
                Write-Host "Port $port - Tentative de fermeture du processus $processName (PID: $processId)" -ForegroundColor Magenta
                
                # Tuer le processus
                Stop-Process -Id $processId -Force
                Write-Host "Processus $processName (PID: $processId) a été terminé avec succès" -ForegroundColor Green
            }
            catch {
                Write-Host "Erreur lors de la fermeture du processus avec PID $processId : $_" -ForegroundColor Red
            }
        }
    }
    else {
        Write-Host "Aucun processus n'écoute sur le port $port" -ForegroundColor Gray
    }
}

Write-Host "`nOpération terminée. Tous les processus utilisant les ports 3000-3003 ont été arrêtés." -ForegroundColor Cyan