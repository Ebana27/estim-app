import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'estim.app',
  appName: 'estim-app',
  webDir: 'dist',
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
        ]
      }
    }
  }
};

export default config;
