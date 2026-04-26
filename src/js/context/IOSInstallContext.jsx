import React, { createContext, useContext, useState, useCallback, useEffect, useMemo } from 'react';

/**
 * Contexte global pour gérer l'affichage de la modale d'installation iOS
 * Permet d'afficher la modale depuis n'importe quel composant
 */
const IOSInstallContext = createContext();
const IOS_INSTALL_PROMPT_SEEN_KEY = 'estim_ios_install_prompt_seen_v1';

export const IOSInstallProvider = ({ children }) => {
  const [isIOS, setIsIOS] = useState(false);
  const [isIPhone, setIsIPhone] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isDetectionReady, setIsDetectionReady] = useState(false);
  const [hasSeenAutoPrompt, setHasSeenAutoPrompt] = useState(false);
  const [showInstallModal, setShowInstallModal] = useState(false);

  const initializeIOSDetection = useCallback(() => {
    const ua = window.navigator.userAgent.toLowerCase();
    const isIOSDevice = /iphone|ipad|ipod/.test(ua);
    const isIPhoneDevice = /iphone/.test(ua);
    const hasStandaloneDisplayMode =
      typeof window.matchMedia === 'function' && window.matchMedia('(display-mode: standalone)').matches;
    const isInStandaloneMode =
      window.navigator.standalone === true || hasStandaloneDisplayMode;

    setIsIOS(isIOSDevice);
    setIsIPhone(isIPhoneDevice);
    setIsStandalone(isInStandaloneMode);
    setIsDetectionReady(true);
  }, []);

  useEffect(() => {
    initializeIOSDetection();
    try {
      setHasSeenAutoPrompt(localStorage.getItem(IOS_INSTALL_PROMPT_SEEN_KEY) === '1');
    } catch {
      setHasSeenAutoPrompt(false);
    }
  }, [initializeIOSDetection]);

  const markAutoPromptSeen = useCallback(() => {
    setHasSeenAutoPrompt(true);
    try {
      localStorage.setItem(IOS_INSTALL_PROMPT_SEEN_KEY, '1');
    } catch {
      // no-op when localStorage is unavailable
    }
  }, []);

  const openInstallModal = useCallback(({ source = 'manual' } = {}) => {
    if (!isIOS || isStandalone) {
      return false;
    }
    if (source === 'auto') {
      markAutoPromptSeen();
    }
    setShowInstallModal(true);
    return true;
  }, [isIOS, isStandalone, markAutoPromptSeen]);

  const closeInstallModal = useCallback(() => {
    setShowInstallModal(false);
  }, []);

  const canShowAutoPrompt = useMemo(() => {
    return isDetectionReady && isIOS && !isStandalone && !hasSeenAutoPrompt;
  }, [hasSeenAutoPrompt, isDetectionReady, isIOS, isStandalone]);

  const value = useMemo(() => ({
    isIOS,
    isIPhone,
    isStandalone,
    isDetectionReady,
    hasSeenAutoPrompt,
    canShowAutoPrompt,
    showInstallModal,
    initializeIOSDetection,
    openInstallModal,
    closeInstallModal,
    markAutoPromptSeen,
  }), [
    canShowAutoPrompt,
    closeInstallModal,
    hasSeenAutoPrompt,
    initializeIOSDetection,
    isDetectionReady,
    isIOS,
    isIPhone,
    isStandalone,
    markAutoPromptSeen,
    openInstallModal,
    showInstallModal,
  ]);

  return (
    <IOSInstallContext.Provider value={value}>
      {children}
    </IOSInstallContext.Provider>
  );
};

/**
 * Hook personnalisé pour accéder au contexte d'installation iOS
 */
export const useIOSInstallContext = () => {
  const context = useContext(IOSInstallContext);
  if (!context) {
    throw new Error('useIOSInstallContext doit être utilisé dans un IOSInstallProvider');
  }
  return context;
};

export default IOSInstallContext;
