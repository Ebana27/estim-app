import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'estim.app',
  appName: 'ESTIM',
  webDir: 'dist',
  ios: {
    preferredLang: 'fr',
    limitsNavigationsToAppBoundDomains: true,
    scrollEnabled: true,
    backgroundColor: '#ffffff',
  },
  android: {
    preferredLang: 'fr',
    buildOptions: {
      keystorePath: undefined,
      keystorePassword: undefined,
      keystoreAlias: undefined,
      keystoreAliasPassword: undefined,
      signingType: 'jarsigner',
    },
  },
  plugins: {
    CapacitorAssets: {
      imagesDimensions: {
        icon: [
          {
            size: 192,
            name: 'ic_launcher_192.png'
          },
          {
            size: 512,
            name: 'ic_launcher_512.png'
          }
        ],
        splash: [
          {
            size: 540,
            name: 'splash-540x720.png'
          },
          {
            size: 720,
            name: 'splash-720x1280.png'
          }
        ],
      }
    },
    StatusBar: {
      style: 'dark',
      backgroundColor: '#3880ff',
    },
    Keyboard: {
      resize: 'body',
      style: 'dark',
    },
    App: {
      allowNavigationBeforeUnload: true,
    },
  },
  server: {
    androidScheme: 'https',
    iosScheme: 'capacitor',
    hostname: 'localhost',
    allowNavigation: ['*'],
  },
}

export default config;
