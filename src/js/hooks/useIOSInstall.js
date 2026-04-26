import { useIOSInstallContext } from '../context/IOSInstallContext';

/**
 * Hook de facade pour acceder au contexte d'installation iOS.
 * Conserve pour compatibilite des imports existants.
 */
export const useIOSInstall = () => useIOSInstallContext();

export default useIOSInstall;