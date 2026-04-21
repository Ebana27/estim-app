// Service Worker pour ESTIM App - PWA iOS
const CACHE_NAME = 'estim-app-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.png',
];

// Installation du Service Worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Service Worker: Cache ouvert');
      return cache.addAll(urlsToCache).catch((error) => {
        console.log('Service Worker: Erreur lors de la mise en cache:', error);
      });
    })
  );
  self.skipWaiting();
});

// Activation du Service Worker
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];

  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhitelist.includes(cacheName)) {
            console.log('Service Worker: Suppression du cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Interception des requêtes
self.addEventListener('fetch', (event) => {
  // Ignorer les requêtes non-GET
  if (event.request.method !== 'GET') {
    return;
  }

  // Stratégie: Cache First, Fall back to Network
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Retourner la réponse en cache si disponible
      if (response) {
        return response;
      }

      return fetch(event.request).then((response) => {
        // Vérifier si c'est une réponse valide
        if (!response || response.status !== 200 || response.type === 'error') {
          return response;
        }

        // Clone la réponse
        const responseToCache = response.clone();

        // Mettre en cache pour les requêtes futures
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });

        return response;
      }).catch(() => {
        // Retourner une page offline si disponible
        return caches.match('/index.html');
      });
    })
  );
});

// Gestion des messages depuis le client
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
