import legacy from '@vitejs/plugin-legacy'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    legacy()
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


