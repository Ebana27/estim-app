import React, { useEffect } from 'react';
import {
  IonModal,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonFooter,
} from '@ionic/react';
import useIOSInstall from '../js/hooks/useIOSInstall';
import './IOSInstallPrompt.css';

const IOS_STEPS = [
  {
    title: 'Touchez Partager dans Safari',
    description: 'Le bouton Partager se trouve en bas de l ecran.',
    icon: 'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/icons/box-arrow-up.svg',
    alt: 'Icone partager iOS',
  },
  {
    title: 'Choisissez Sur l ecran d accueil',
    description: 'Faites defiler la liste d actions puis selectionnez cette option.',
    icon: 'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/icons/plus-square.svg',
    alt: 'Icone ajouter sur ecran d accueil',
  },
  {
    title: 'Confirmez avec Ajouter',
    description: 'ESTIM apparaitra ensuite sur votre ecran d accueil.',
    icon: 'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/icons/check2-circle.svg',
    alt: 'Icone confirmation installation',
  },
];

/**
 * Modale iOS pour guider l'installation PWA.
 * Affichage automatique une seule fois, ouverture manuelle via contexte.
 */
const IOSInstallPrompt = () => {
  const { isIOS, isStandalone, showInstallModal, closeInstallModal, openInstallModal, canShowAutoPrompt } =
    useIOSInstall();

  useEffect(() => {
    if (canShowAutoPrompt) {
      openInstallModal({ source: 'auto' });
    }
  }, [canShowAutoPrompt, openInstallModal]);

  if (!isIOS || isStandalone) {
    return null;
  }

  return (
    <IonModal isOpen={showInstallModal} onDidDismiss={closeInstallModal} className="ios-install-modal">
      <IonHeader className="ion-no-border">
        <IonToolbar>
          <IonTitle>Installer ESTIM sur iPhone</IonTitle>
          <IonButton slot="end" fill="clear" onClick={closeInstallModal} className="ios-install-close-btn">
            Fermer
          </IonButton>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <div className="install-shell">
          <div className="install-hero">
            <img
              src="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/icons/phone.svg"
              alt="iPhone"
              className="install-hero-icon"
            />
            <h2>Ajoutez ESTIM a votre ecran d accueil</h2>
            <p>
              iOS ne propose pas de popup d installation automatique. Suivez ces etapes pour installer ESTIM comme
              une app native.
            </p>
          </div>

          <div className="install-steps" role="list" aria-label="Etapes installation iOS">
            {IOS_STEPS.map((step, index) => (
              <article key={step.title} className="install-step" role="listitem">
                <div className="step-index" aria-hidden="true">
                  {index + 1}
                </div>
                <img src={step.icon} alt={step.alt} className="step-cdn-icon" loading="lazy" />
                <div className="step-copy">
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                </div>
              </article>
            ))}
          </div>

          <div className="install-note">
            <strong>Note :</strong> Le nom et l icone peuvent etre personnalises par l utilisateur apres installation
            sur iOS.
          </div>
        </div>
      </IonContent>

      <IonFooter className="ion-no-border ios-install-footer">
        <IonToolbar>
          <IonButton expand="block" color="primary" onClick={closeInstallModal} size="large">
            Compris
          </IonButton>
        </IonToolbar>
      </IonFooter>
    </IonModal>
  );
};

export default IOSInstallPrompt;