# Script PowerShell pour générer les icônes PWA iOS
# Usage: .\generate-pwa-icons.ps1 -SourceImage source-image.png

param(
    [Parameter(Mandatory=$true)]
    [string]$SourceImage,
    
    [Parameter(Mandatory=$false)]
    [string]$OutputDir = ".\icons",
    
    [Parameter(Mandatory=$false)]
    [string]$BackgroundColor = "white"
)

Write-Host "=== Générateur d'Icônes PWA iOS ===" -ForegroundColor Cyan
Write-Host ""

# Vérifier que le fichier source existe
if (-not (Test-Path $SourceImage)) {
    Write-Host "Erreur: Le fichier '$SourceImage' n'existe pas." -ForegroundColor Red
    exit 1
}

# Vérifier que ImageMagick est installé
$magickPath = Get-Command magick -ErrorAction SilentlyContinue

if (-not $magickPath) {
    Write-Host "Erreur: ImageMagick n'est pas installé ou n'est pas dans le PATH." -ForegroundColor Red
    Write-Host ""
    Write-Host "Installation pour Windows:" -ForegroundColor Yellow
    Write-Host "  1. Via Chocolatey: choco install imagemagick"
    Write-Host "  2. Via Scoop: scoop install imagemagick"
    Write-Host "  3. Télécharger: https://imagemagick.org/script/download.php#windows"
    Write-Host ""
    exit 1
}

# Créer le répertoire de sortie
if (-not (Test-Path $OutputDir)) {
    New-Item -ItemType Directory -Path $OutputDir | Out-Null
    Write-Host "Répertoire créé: $OutputDir" -ForegroundColor Green
}

Write-Host "Source: $SourceImage" -ForegroundColor Cyan
Write-Host "Destination: $OutputDir" -ForegroundColor Cyan
Write-Host "Couleur de fond: $BackgroundColor" -ForegroundColor Cyan
Write-Host ""
Write-Host "Génération des icônes..." -ForegroundColor Yellow
Write-Host ""

# Tailles requises pour PWA iOS
$sizes = @(144, 152, 180, 192, 256, 512)
$successCount = 0
$errorCount = 0

foreach ($size in $sizes) {
    $outputFile = "$OutputDir\icon-$size.png"
    Write-Host "Génération: $outputFile (${size}x${size})" -ForegroundColor Cyan
    
    try {
        # Utiliser ImageMagick pour redimensionner et centrer l'image
        & magick convert "$SourceImage" -resize "${size}x${size}" -background $BackgroundColor -gravity center -extent "${size}x${size}" "$outputFile" 2>&1 | Out-Null
        
        if (Test-Path $outputFile) {
            Write-Host "  ✓ Créé avec succès" -ForegroundColor Green
            $successCount++
        } else {
            Write-Host "  ✗ Erreur lors de la création" -ForegroundColor Red
            $errorCount++
        }
    }
    catch {
        Write-Host "  ✗ Erreur: $($_)" -ForegroundColor Red
        $errorCount++
    }
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Résultat: $successCount réussis, $errorCount erreurs" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

if ($errorCount -eq 0) {
    Write-Host "✓ Génération complète!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Prochaines étapes:" -ForegroundColor Yellow
    Write-Host "1. Vérifier que les fichiers PNG sont dans $OutputDir"
    Write-Host "2. Exécuter: npm run build"
    Write-Host "3. Tester la PWA sur iOS"
    Write-Host ""
}
else {
    Write-Host "✗ Des erreurs se sont produites durant la génération." -ForegroundColor Red
    exit 1
}
