#!/bin/bash

# Script pour générer les icônes PWA iOS
# Usage: ./generate-pwa-icons.sh source-image.png

if [ ! "$1" ]; then
  echo "Usage: $0 source-image.png"
  echo ""
  echo "Ce script génère les icônes PWA iOS requis à partir d'une image source."
  echo "L'image source doit être carrée et d'au moins 512x512 pixels."
  echo ""
  echo "Icônes générés:"
  echo "  - 144x144 (icon-144.png)"
  echo "  - 152x152 (icon-152.png)"
  echo "  - 180x180 (icon-180.png) [CRITIQUE pour iOS]"
  echo "  - 192x192 (icon-192.png)"
  echo "  - 256x256 (icon-256.png)"
  echo "  - 512x512 (icon-512.png)"
  echo ""
  echo "Prérequis: ImageMagick (convert) ou GraphicsMagick"
  echo "Installation:"
  echo "  macOS: brew install imagemagick"
  echo "  Linux: sudo apt-get install imagemagick"
  echo "  Windows: choco install imagemagick"
  exit 1
fi

SOURCE_IMAGE="$1"
ICONS_DIR="./icons"

# Vérifier que le fichier source existe
if [ ! -f "$SOURCE_IMAGE" ]; then
  echo "Erreur: Le fichier '$SOURCE_IMAGE' n'existe pas."
  exit 1
fi

# Vérifier que convert est disponible
if ! command -v convert &> /dev/null; then
  echo "Erreur: ImageMagick (convert) n'est pas installé."
  echo "Installation:"
  echo "  macOS: brew install imagemagick"
  echo "  Linux: sudo apt-get install imagemagick"
  echo "  Windows: choco install imagemagick"
  exit 1
fi

# Créer le répertoire icons s'il n'existe pas
mkdir -p "$ICONS_DIR"

echo "Génération des icônes PWA iOS..."
echo "Source: $SOURCE_IMAGE"
echo "Destination: $ICONS_DIR"
echo ""

# Tailles requises pour PWA iOS
declare -a SIZES=(144 152 180 192 256 512)

for SIZE in "${SIZES[@]}"; do
  OUTPUT_FILE="$ICONS_DIR/icon-${SIZE}.png"
  echo "Génération: $OUTPUT_FILE (${SIZE}x${SIZE})"
  convert "$SOURCE_IMAGE" -resize "${SIZE}x${SIZE}" -background white -gravity center -extent "${SIZE}x${SIZE}" "$OUTPUT_FILE"
  if [ $? -eq 0 ]; then
    echo "  ✓ Créé avec succès"
  else
    echo "  ✗ Erreur lors de la création"
  fi
done

echo ""
echo "✓ Génération complète!"
echo ""
echo "Prochaines étapes:"
echo "1. Vérifier que les fichiers PNG ont le format correct"
echo "2. Exécuter: npm run build"
echo "3. Tester la PWA sur iOS"
echo ""
