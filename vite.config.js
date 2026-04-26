import legacy from '@vitejs/plugin-legacy'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    legacy(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.png', 'icons/**/*.{png,webp}', 'robots.txt', 'manifest.json', 'sw.js'],
      manifest: {
        name: 'ESTIM',
        short_name: 'ESTIM',
        description: 'Application de gestion scolaire ESTIM',
        theme_color: '#3880ff',
        background_color: '#ffffff',
        start_url: '/',
        scope: '/',
        display: 'standalone',
        orientation: 'portrait-primary',
        categories: ['education', 'productivity'],
        screenshots: [
          {
            src: '/icons/screenshot-540x720.png',
            type: 'image/png',
            sizes: '540x720',
            form_factor: 'narrow'
          },
          {
            src: '/icons/screenshot-1280x720.png',
            type: 'image/png',
            sizes: '1280x720',
            form_factor: 'wide'
          }
        ],
        icons: [
          {
            src: '/icons/icon-180.png',
            sizes: '180x180',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: '/icons/icon-192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any maskable'
          },
          {
            src: '/icons/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,woff2,png,jpg,svg,gif,webp,json}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/api\./i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24 // 24 heures
              }
            }
          },
          {
            urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp)$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'image-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 * 30 // 30 jours
              }
            }
          }
        ]
      },
      devOptions: {
        enabled: true
      }
    })
  ],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/js/setupTests.js',
  },
  server: {
    // Configuration du serveur de développement
    headers: {
      'Service-Worker-Allowed': '/',
      'Cache-Control': 'no-cache',
    },
    mimeTypes: {
      'application/json': ['json'],
      'image/webp': ['webp'],
    },
  },
  build: {
    // Configuration de build
    rollupOptions: {
      output: {
        // Optimiser le chunking avec une fonction
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react')) {
              return 'vendor-react';
            }
            if (id.includes('@ionic')) {
              return 'vendor-ionic';
            }
            return 'vendor';
          }
        },
      },
    },
    // Assurer que manifest.json et sw.js ne sont pas hashés
    assetsDir: 'assets',
    manifest: false,
  },
  // Configuration pour les assets PWA
  publicDir: 'public',
})

