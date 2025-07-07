$basePath = "C:\CREW-CRM"

# Créer des scripts temporaires pour chaque service
$tempDir = "$env:TEMP\crm_services"
if (!(Test-Path $tempDir)) {
    New-Item -Path $tempDir -ItemType Directory -Force | Out-Null
}

# Créer les scripts pour chaque service avec echo pour le débogage
$authScript = @"
@echo off
echo Démarrage du service d'authentification...
cd /d "$basePath\authentication-service"
echo Installation des dépendances...
call npm i
echo Démarrage du service...
call npm run dev
"@
Set-Content -Path "$tempDir\auth.cmd" -Value $authScript -Encoding ASCII

$bddScript = @"
@echo off
echo Démarrage du service de base de données...
cd /d "$basePath\bdd-service"
echo Installation des dépendances...
call npm i
echo Démarrage du service...
call npm run dev
"@
Set-Content -Path "$tempDir\bdd.cmd" -Value $bddScript -Encoding ASCII

$frontScript = @"
@echo off
echo Démarrage du service frontend...
cd /d "$basePath\front"
echo Installation des dépendances...
call npm i
echo Démarrage du service...
call npm run dev
"@
Set-Content -Path "$tempDir\front.cmd" -Value $frontScript -Encoding ASCII

$notifScript = @"
@echo off
echo Démarrage du service de notification...
cd /d "$basePath\notification-mail-sms-service"
echo Installation des dépendances...
call npm i
echo Démarrage du service...
call npm run dev
"@
Set-Content -Path "$tempDir\notif.cmd" -Value $notifScript -Encoding ASCII

$metricsScript = @"
@echo off
echo Démarrage du service de metrics...
cd /d "$basePath\metrics-service"
echo Installation des dépendances...
call npm i
echo Démarrage du service...
call npm run dev
"@
Set-Content -Path "$tempDir\metrics.cmd" -Value $metricsScript -Encoding ASCII

$paymentScript = @"
@echo off
echo Démarrage du service de metrics...
cd /d "$basePath\payment-service"
echo Installation des dépendances...
call npm i
echo Démarrage du service...
call npm run dev
"@
Set-Content -Path "$tempDir\payment.cmd" -Value $paymentScript -Encoding ASCII


$iaScript = @"
@echo off
echo Démarrage du service de metrics...
cd /d "$basePath\service-ia"
echo Installation des dépendances...
call npm i
echo Démarrage du service...
call npm run dev
"@
Set-Content -Path "$tempDir\ia.cmd" -Value $iaScript -Encoding ASCII

# Lancer Windows Terminal avec les scripts
Write-Host "Lancement de Windows Terminal avec les services fractionnés..." -ForegroundColor Green
try {
    Start-Process "wt" -ArgumentList @"
new-tab --title "Auth Service" cmd.exe /k "$tempDir\auth.cmd"; split-pane -H cmd.exe /k "$tempDir\bdd.cmd"; move-focus up; split-pane -V cmd.exe /k "$tempDir\front.cmd"; move-focus right; split-pane -V cmd.exe /k "$tempDir\notif.cmd"; move-focus right; split-pane -V cmd.exe /k "$tempDir\metrics.cmd";  move-focus down; split-pane -V cmd.exe /k "$tempDir\payment.cmd"; move-focus left; split-pane -V cmd.exe /k "$tempDir\ia.cmd"
"@
    Write-Host "Windows Terminal a été lancé avec succès." -ForegroundColor Green
} catch {
    Write-Host "Erreur lors du lancement de Windows Terminal: $_" -ForegroundColor Red
    
    # En cas d'échec, utiliser la méthode classique
    Write-Host "Utilisation de fenêtres séparées à la place..." -ForegroundColor Yellow
    Start-Process cmd -ArgumentList "/k", "$tempDir\auth.cmd"
    Start-Process cmd -ArgumentList "/k", "$tempDir\bdd.cmd"
    Start-Process cmd -ArgumentList "/k", "$tempDir\front.cmd"
    Start-Process cmd -ArgumentList "/k", "$tempDir\notif.cmd"
    Start-Process cmd -ArgumentList "/k", "$tempDir\metrics.cmd"
    Start-Process cmd -ArgumentList "/k", "$tempDir\payment.cmd"
    Start-Process cmd -ArgumentList "/k", "$tempDir\ia.cmd"
}