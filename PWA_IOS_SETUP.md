# Configuration PWA pour iOS - ESTIM App

Ce document explique la configuration complète pour supporter ESTIM App comme Progressive Web App (PWA) sur iOS.

## ✅ Configurations Implémentées

### 1. **index.html - Métadonnées PWA iOS**
- ✅ `apple-mobile-web-app-capable`: Active le mode standalone sur iOS
- ✅ `apple-mobile-web-app-title`: Nom affiché sur l'écran d'accueil
- ✅ `apple-mobile-web-app-status-bar-style`: Style de la barre de statut (black-translucent)
- ✅ `apple-touch-icon`: Icônes pour l'écran d'accueil iOS (180x180, 152x152, 144x144)
- ✅ `theme-color`: Couleur du thème (bleu Ionic)
- ✅ Service Worker: Script d'enregistrement inclus

### 2. **Service Worker (public/sw.js)**
- ✅ Stratégie Cache First avec fallback réseau
- ✅ Gestion du cache et mise à jour
- ✅ Support offline
- ✅ Interception des requêtes GET

### 3. **Manifest.json**
- ✅ Configuration complète PWA W3C
- ✅ Icônes multiples (formats webp et png)
- ✅ Screenshots pour app store
- ✅ Catégories et descriptions
- ✅ Support des raccourcis d'app
- ✅ Share Target API

### 4. **capacitor.config.ts**
- ✅ Configuration iOS spécifique
- ✅ Configuration du server
- ✅ Plugins: StatusBar, Keyboard, App
- ✅ Support des schémas HTTPS et capacitor

## ⚠️ Actions Requises

### 1. **Créer les Icônes Requises** (essentielles pour iOS)

Vous devez générer les fichiers PNG suivants dans le répertoire `icons/`:

```
icons/
├── icon-144.png          (144x144) - Pour PWA
├── icon-152.png          (152x152) - Pour iPad
├── icon-180.png          (180x180) - Pour iPhone (CRITIQUE)
├── icon-192.png          (192x192) - Pour Android/Web
├── icon-256.png          (256x256) - Pour le manifest
├── icon-512.png          (512x512) - Pour le manifest
├── splash-750x1334.png   (750x1334) - Splash iPhone 6/7/8
├── splash-1125x2436.png  (1125x2436) - Splash iPhone X/11/12/13
├── splash-1242x2688.png  (1242x2688) - Splash iPhone XS Max/11 Pro Max
├── screenshot-540x720.png (540x720) - Screenshot mobile
└── screenshot-1280x720.png (1280x720) - Screenshot desktop
```

**Recommandation**: Les fichiers PNG pour iOS doivent avoir:
- **Background blanc** ou avec dégradé
- **Sans transparence** pour les splash screens
- **Dimensions exactes** (ne pas redimensionner)

### 2. **Générer les Icônes** (Optionnel - Outil Recommandé)

Utilisez un des outils suivants:

**Option 1: Capacitor Assets CLI**
```bash
npm run capacitor:assets
```

**Option 2: PWA Asset Generator**
```bash
npm install -g pwa-asset-generator
pwa-asset-generator icon-base.png ./icons --background "#ffffff" --padding 20
```

**Option 3: Online Tools**
- [Web App Manifest Generator](https://www.simicart.com/manifest-generator.html)
- [PWA Asset Generator](https://www.pwabuilder.com/)

### 3. **Tester la PWA sur iOS**

#### Via Safari (macOS)
1. Ouvrez Safari
2. Tapez l'URL locale: `http://localhost:5173` (ou votre port vite)
3. Appuyez sur le bouton de partage (flèche vers le haut)
4. Sélectionnez "Ajouter à l'écran d'accueil"

#### Via Xcode
```bash
npm run build
npx cap open ios
```

### 4. **Vérifier la Configuration**

Utilisez les outils suivants pour vérifier:

**Lighthouse (Chrome DevTools)**
- Ouvrez Chrome DevTools (F12)
- Onglet Lighthouse
- Générez un rapport PWA
- Cherchez les avertissements

**PWA Audit**
- [PWA Builder Validator](https://www.pwabuilder.com/)
- [Maskable.app](https://maskable.app/) - Pour tester les icônes maskables

### 5. **Configuration Adicionale pour iOS**

#### Ajouter un Fichier web.config (IIS - Optionnel)
Si vous servez via IIS, créez `web.config`:
```xml
<?xml version="1.0" encoding="UTF-8"?>
<configuration>
  <system.webServer>
    <staticContent>
      <mimeMap fileExtension=".webp" mimeType="image/webp" />
      <mimeMap fileExtension=".json" mimeType="application/json" />
    </staticContent>
  </system.webServer>
</configuration>
```

#### Activer Support iOS Offline
Les PWA iOS fonctionnent mieux avec:
- ✅ Service Worker (déjà configuré)
- ✅ Cache Strategy (déjà configuré)
- ✅ Metadonnées apple-touch-icon (déjà configuré)

## 📋 Checklist Finale

- [ ] Générer/placer les icônes PNG (144x144, 152x152, 180x180, 192x192, 256x256, 512x512)
- [ ] Générer/placer les splash screens (750x1334, 1125x2436, 1242x2688)
- [ ] Tester avec Lighthouse - Score PWA > 90
- [ ] Tester l'ajout à l'écran d'accueil sur iOS (Safari + "Ajouter à l'écran")
- [ ] Vérifier l'icône affichée sur l'écran d'accueil
- [ ] Tester le Service Worker (DevTools > Application > Service Workers)
- [ ] Tester le mode offline (DevTools > Network > Offline)
- [ ] Vérifier manifest.json: `curl http://localhost:5173/manifest.json`
- [ ] Build et déployer: `npm run build && npm run capacitor:sync`

## 🔗 Ressources Utiles

- [Apple App Clip Documentation](https://developer.apple.com/app-clips/)
- [PWA on iOS - Webkit Blog](https://webkit.org/blog/10882/pwa-improvements-in-ios-14/)
- [MDN - Progressive Web Apps](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps)
- [Web.dev - PWA Checklist](https://web.dev/pwa-checklist/)

## 🐛 Troubleshooting

### L'icône n'apparaît pas sur iOS
- Vérifier que le fichier `icon-180.png` existe et est exact 180x180px
- Vider le cache Safari: Settings > Safari > Clear History and Website Data
- Réessayer l'ajout à l'écran d'accueil

### Service Worker ne se charge pas
- Vérifier console DevTools pour les erreurs
- S'assurer que sw.js est dans `public/`
- Vérifier que le site est en HTTPS (ou localhost)

### Splash screen n'apparaît pas
- iOS ne montre les splash screens que pour les apps installées
- Vérifier que les fichiers ont les dimensions exactes
- Les splash screens sont optionnels pour PWA iOS

---

**Dernière mise à jour**: avril 2026
**Version de l'app**: 0.0.0
