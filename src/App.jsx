/* src\App.jsx */
import { useState } from "react";
import { Redirect, Route } from "react-router-dom";
import {
  IonApp,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  setupIonicReact,
} from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import {
  homeOutline,
  appsOutline,
  megaphoneOutline,
  chevronForwardOutline,
  chevronBackOutline,
} from "ionicons/icons";

import HomePage from "./pages/HomePage";
import AppPage from "./pages/AppPage";
import AdPage from "./pages/AdPage";
import EdtPage from "./pages/EdtPage";
import AbsencePage from "./pages/AbsencePage";
import LibraryPage from "./pages/LibraryPage";
import ResourcesPage from "./pages/ResourcesPage";
import PresencePage from "./pages/PresencePage";
import NotesPage from "./pages/NotesPage";
import NetworkCheck from "./components/NetworkCheck";
import studentSvg from "./assets/img/student.svg";

/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";

/* Theme ESTIM */
import "./theme/variables.css";
import "./App.css";

setupIonicReact();

const onboardingKey = "estim_onboarding_hide";
const onboardingSlides = [
  {
    title: "Ton rythme, sans stress",
    body: "ESTIM clarifie ta semaine en un coup d'oeil. Tu vois l'essentiel, tu avances sereinement.",
  },
  {
    title: "Moins d'oubli, plus de focus",
    body: "Les cours importants sont mis en avant pour t'aider a arriver pret, meme les jours charges.",
  },
  {
    title: "Garde le cap toute l'annee",
    body: "Avec ESTIM, tu restes organise, tu gagnes du temps et tu profites plus du campus.",
  },
];

const App = () => {
  const [onboardingStep, setOnboardingStep] = useState(0);
  const [dontShowAgain, setDontShowAgain] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(() => {
    try {
      return localStorage.getItem(onboardingKey) !== "1";
    } catch {
      return true;
    }
  });

  const closeOnboarding = () => {
    if (dontShowAgain) {
      try {
        localStorage.setItem(onboardingKey, "1");
      } catch {
        // no-op if storage unavailable
      }
    }
    setShowOnboarding(false);
  };

  const goNext = () => {
    if (onboardingStep >= onboardingSlides.length - 1) {
      closeOnboarding();
    } else {
      setOnboardingStep((prev) => prev + 1);
    }
  };

  const goPrev = () => {
    setOnboardingStep((prev) => Math.max(0, prev - 1));
  };

  return (
    <IonApp>
      {showOnboarding && (
        <section className="estim-onboard">
          <div className="estim-onboard__card">
            <div className="estim-onboard__top">
              <button className="estim-onboard__skip" onClick={closeOnboarding}>
                Passer
              </button>
            </div>

            <div className="estim-onboard__media">
              <img src={studentSvg} alt="Etudiant" />
            </div>

            <div className="estim-onboard__content">
              <h2>{onboardingSlides[onboardingStep].title}</h2>
              <p>{onboardingSlides[onboardingStep].body}</p>
            </div>

            <div className="estim-onboard__prefs">
              <button
                className={`estim-onboard__toggle ${dontShowAgain ? "is-active" : ""}`}
                onClick={() => setDontShowAgain((prev) => !prev)}
              >
                <span className="estim-onboard__toggle-box" />
                Ne plus afficher
              </button>
            </div>

            <div className="estim-onboard__footer">
              <button
                className="estim-onboard__nav-btn"
                onClick={goPrev}
                disabled={onboardingStep === 0}
                aria-label="Precedent"
              >
                <IonIcon icon={chevronBackOutline} />
              </button>

              <div className="estim-onboard__dots">
                {onboardingSlides.map((_, i) => (
                  <span key={i} className={`estim-onboard__dot ${i === onboardingStep ? "is-active" : ""}`} />
                ))}
              </div>

              <button className="estim-onboard__nav-btn" onClick={goNext} aria-label="Suivant">
                <IonIcon icon={chevronForwardOutline} />
              </button>
            </div>
          </div>
        </section>
      )}

      <NetworkCheck />
      <IonReactRouter>
        <IonTabs>
          <IonRouterOutlet>
            <Route exact path="/home">
              <HomePage />
            </Route>
            <Route exact path="/apps">
              <AppPage />
            </Route>
            <Route exact path="/annonces">
              <AdPage />
            </Route>
            <Route exact path="/edt">
              <EdtPage />
            </Route>
            <Route exact path="/absences">
              <AbsencePage />
            </Route>
            <Route exact path="/bibliotheque">
              <LibraryPage />
            </Route>
            <Route exact path="/ressources">
              <ResourcesPage />
            </Route>
            <Route exact path="/presence">
              <PresencePage />
            </Route>
            <Route exact path="/notes">
              <NotesPage />
            </Route>
            <Route exact path="/">
              <Redirect to="/home" />
            </Route>
          </IonRouterOutlet>

          <IonTabBar slot="bottom">
            <IonTabButton tab="home" href="/home">
              <IonIcon icon={homeOutline} />
              <IonLabel>Accueil</IonLabel>
            </IonTabButton>
            <IonTabButton tab="apps" href="/apps">
              <IonIcon icon={appsOutline} />
              <IonLabel>Apps</IonLabel>
            </IonTabButton>
            <IonTabButton tab="annonces" href="/annonces">
              <IonIcon icon={megaphoneOutline} />
              <IonLabel>Annonces</IonLabel>
            </IonTabButton>
          </IonTabBar>
        </IonTabs>
      </IonReactRouter>
    </IonApp>
  );
};

export default App;
