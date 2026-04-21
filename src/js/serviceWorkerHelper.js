/**
 * Service Worker Helper pour PWA iOS
 * Gère l'enregistrement, les mises à jour et les notifications du Service Worker
 */

/**
 * Enregistre le Service Worker et gère les mises à jour
 */
export const registerServiceWorker = async () => {
  if (!('serviceWorker' in navigator)) {
    console.log('Service Worker non supporté dans ce navigateur');
    return null;
  }

  try {
    const registration = await navigator.serviceWorker.register('/sw.js', {
      scope: '/',
    });

    console.log('Service Worker enregistré avec succès:', registration);

    // Écouter les mises à jour
    registration.addEventListener('updatefound', () => {
      const newWorker = registration.installing;
      
      if (newWorker) {
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'activated') {
            console.log('Nouvelle version du Service Worker activée');
            // Notifier l'utilisateur de la nouvelle version
            notifyUpdateAvailable();
          }
        });
      }
    });

    // Vérifier les mises à jour toutes les heures
    setInterval(() => {
      registration.update();
    }, 60 * 60 * 1000);

    return registration;
  } catch (error) {
    console.error('Erreur lors de l\'enregistrement du Service Worker:', error);
    return null;
  }
};

/**
 * Notifie l'utilisateur qu'une mise à jour est disponible
 */
export const notifyUpdateAvailable = () => {
  // Créer une notification ou un toast
  console.log('📲 Nouvelle version disponible! Rechargez la page.');
  
  // Exemple: Afficher une notification toast
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification('ESTIM App Mise à jour', {
      body: 'Une nouvelle version est disponible! Rechargez la page.',
      icon: '/icons/icon-192.png',
      badge: '/icons/icon-192.png',
    });
  }
};

/**
 * Demande la permission pour les notifications
 */
export const requestNotificationPermission = async () => {
  if (!('Notification' in window)) {
    console.log('Notifications non supportées');
    return false;
  }

  if (Notification.permission === 'granted') {
    return true;
  }

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  return false;
};

/**
 * Envoie un message au Service Worker
 */
export const sendMessageToServiceWorker = (message) => {
  if (navigator.serviceWorker && navigator.serviceWorker.controller) {
    navigator.serviceWorker.controller.postMessage(message);
  }
};

/**
 * Force la mise à jour du Service Worker
 */
export const skipWaiting = async () => {
  const registration = await navigator.serviceWorker.getRegistration();
  
  if (registration && registration.waiting) {
    sendMessageToServiceWorker({ type: 'SKIP_WAITING' });
    
    // Recharger quand le nouveau worker prend le contrôle
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      window.location.reload();
    });
  }
};

/**
 * Vérifie si l'app est installée (mode standalone)
 */
export const isAppInstalled = () => {
  // iOS
  if (window.navigator.standalone === true) {
    return true;
  }

  // Android
  if (window.matchMedia('(display-mode: standalone)').matches) {
    return true;
  }

  return false;
};

/**
 * Vérifie si l'app fonctionne en mode offline
 */
export const isOffline = () => {
  return !navigator.onLine;
};

/**
 * Vérifie si la PWA est installable
 */
export const isPWAInstallable = () => {
  return (
    'serviceWorker' in navigator &&
    'PushManager' in window &&
    'Notification' in window
  );
};

/**
 * Obtient les informations du Service Worker
 */
export const getServiceWorkerInfo = async () => {
  try {
    const registrations = await navigator.serviceWorker.getRegistrations();
    
    if (registrations.length === 0) {
      return null;
    }

    const registration = registrations[0];
    
    return {
      active: registration.active ? 'active' : null,
      installing: registration.installing ? 'installing' : null,
      waiting: registration.waiting ? 'waiting' : null,
      scope: registration.scope,
      updateViaCache: registration.updateViaCache,
    };
  } catch (error) {
    console.error('Erreur lors de la récupération des infos:', error);
    return null;
  }
};

/**
 * Unregistre le Service Worker
 */
export const unregisterServiceWorker = async () => {
  try {
    const registrations = await navigator.serviceWorker.getRegistrations();
    
    for (const registration of registrations) {
      await registration.unregister();
    }
    
    console.log('Service Worker unregistered');
  } catch (error) {
    console.error('Erreur lors de l\'unregistration:', error);
  }
};

/**
 * Hook React pour gérer le Service Worker
 */
export const useServiceWorker = () => {
  const [isInstalled, setIsInstalled] = React.useState(false);
  const [isOfflineMode, setIsOfflineMode] = React.useState(false);
  const [swInfo, setSwInfo] = React.useState(null);

  React.useEffect(() => {
    // Enregistrer le Service Worker
    registerServiceWorker().then((registration) => {
      if (registration) {
        setIsInstalled(true);
        getServiceWorkerInfo().then(setSwInfo);
      }
    });

    // Écouter les changements de connexion
    const handleOnline = () => setIsOfflineMode(false);
    const handleOffline = () => setIsOfflineMode(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Vérifier l'état initial
    setIsOfflineMode(isOffline());

    // Cleanup
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return {
    isInstalled,
    isOfflineMode,
    swInfo,
    requestNotificationPermission,
    skipWaiting,
    isAppInstalled: isAppInstalled(),
  };
};

export default {
  registerServiceWorker,
  notifyUpdateAvailable,
  requestNotificationPermission,
  sendMessageToServiceWorker,
  skipWaiting,
  isAppInstalled,
  isOffline,
  isPWAInstallable,
  getServiceWorkerInfo,
  unregisterServiceWorker,
};
