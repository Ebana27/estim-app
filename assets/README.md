# Capacitor Assets

Ce dossier contient les ressources d'images pour générer automatiquement les icônes et splash screens de l'application.

## Fichiers requis

Placez les fichiers suivants dans ce dossier :

### 1. **icon.png** (requiert)
- **Dimensions** : 1024x1024 pixels minimum (recommandé : 1024x1024 ou 2048x2048)
- **Format** : PNG avec transparence (alpha channel)
- **Utilisation** : Générera les icônes pour iOS, Android et web
- **Note** : L'arrière-plan doit être transparent

### 2. **splash.png** (optionnel)
- **Dimensions** : 2732x2732 pixels minimum (recommandé : 2732x2732)
- **Format** : PNG
- **Utilisation** : Générera les écrans de démarrage (splash screens) pour iOS et Android
- **Note** : Utilisez une image carrée pour une meilleure couverture

## Commandes disponibles

### Générer les assets
```bash
npm run capacitor:assets
```

Cette commande va :
- Lire icon.png et splash.png
- Générer les icônes dans les bonnes résolutions pour Android, iOS et web
- Placer les fichiers générés dans `./public`

### Synchroniser avec Capacitor
```bash
npm run capacitor:sync
```

### Construire pour Android
```bash
npm run capacitor:build
```

## Instructions étape par étape

1. **Préparer vos images**
   - Créez ou téléchargez une image d'icône (1024x1024+)
   - Optionnellement, créez une image splash screen (2732x2732)
   - Placez-les dans le dossier `/assets`

2. **Générer les assets**
   ```bash
   npm run capacitor:assets
   ```

3. **Synchroniser l'application**
   ```bash
   npm run capacitor:sync
   ```

4. **Construire l'application**
   ```bash
   npm run capacitor:build
   ```

## Ressources utiles

- [Capacitor Assets Plugin](https://github.com/ionic-team/capacitor-assets)
- [Ionic Icon Generator](https://www.buildicons.com/)
- Outils de design : Figma, Adobe XD, GIMP (gratuit)

## Format des icônes

- **iOS** : Carré, sans sécurité (safe area) - utilise des angles arrondis
- **Android** : Carré ou circulaire selon les paramètres du téléphone
- **Web** : Carré, utilisé dans PWA et bookmarks

Pour de meilleurs résultats, créez une icône simple et reconnaissable qui reste lisible à toutes les tailles.
