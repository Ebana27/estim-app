import { useState } from "react";
import { Redirect, Route, useLocation } from "react-router-dom";
import {
  IonApp,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  IonToast,
  setupIonicReact,
} from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";

import HomePage from "./pages/HomePage";
import AppPage from "./pages/AppPage";
import AdPage from "./pages/AdPage";
import EdtPage from "./pages/EdtPage";
import AbsencePage from "./pages/AbsencePage";
import LibraryPage from "./pages/LibraryPage";
import ResourcesPage from "./pages/ResourcesPage";
import PresencePage from "./pages/PresencePage";
import NotesPage from "./pages/NotesPage";
import OnboardingPage from "./pages/OnboardingPage";

import NetworkCheck from "./components/NetworkCheck";

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

import "./theme/variables.css";
import "./App.css";
import HomeIcon from "./assets/img/Home.svg";
import AppsIcon from "./assets/img/AppsIcon.svg";
import ProfileIcon from "./assets/img/profile.svg";

setupIonicReact();

const onboardingKey = "estim_onboarding_hide";
const getShouldShowOnboarding = () => {
  return false;
};

const AppRoutes = ({ shouldShowOnboarding, onOnboardingDone }) => {
  const location = useLocation();
  const hideTabs = location.pathname === "/onboarding";
  const guard = (content) => (shouldShowOnboarding ? <Redirect to="/onboarding" /> : content);
  const [showProfileToast, setShowProfileToast] = useState(false);

  const handleProfileClick = (event) => {
    event.preventDefault();
    setShowProfileToast(true);
  };

  return (
    <>
      <IonRouterOutlet>
        <Route exact path="/onboarding">
          <Redirect to="/home" />
        </Route>
        <Route exact path="/">
          <Redirect to={shouldShowOnboarding ? "/onboarding" : "/home"} />
        </Route>
      </IonRouterOutlet>

      {!hideTabs && (
        <IonTabs>
          <IonRouterOutlet>
            <Route exact path="/home">{guard(<HomePage />)}</Route>
            <Route exact path="/apps">{guard(<AppPage />)}</Route>
            <Route exact path="/annonces">{guard(<AdPage />)}</Route>
            <Route exact path="/edt">{guard(<EdtPage />)}</Route>
            <Route exact path="/absences">{guard(<AbsencePage />)}</Route>
            <Route exact path="/bibliotheque">{guard(<LibraryPage />)}</Route>
            <Route exact path="/ressources">{guard(<ResourcesPage />)}</Route>
            <Route exact path="/presence">{guard(<PresencePage />)}</Route>
            <Route exact path="/notes">{guard(<NotesPage />)}</Route>
          </IonRouterOutlet>

          <IonTabBar slot="bottom">
            <IonTabButton tab="home" href="/home">
              <img className="tab-icon-image tab-icon-home" src={HomeIcon} alt="" aria-hidden="true" />
              <IonLabel>Accueil</IonLabel>
            </IonTabButton>
            <IonTabButton tab="apps" href="/apps">
              <img className="tab-icon-image" src={AppsIcon} alt="" aria-hidden="true" />
              <IonLabel>Apps</IonLabel>
            </IonTabButton>
            <IonTabButton tab="profile" onClick={handleProfileClick}>
              <img className="tab-icon-image tab-icon-profile" src={ProfileIcon} alt="" aria-hidden="true" />
              <IonLabel>Profile</IonLabel>
            </IonTabButton>
          </IonTabBar>
        </IonTabs>
      )}

      <IonToast
        isOpen={showProfileToast}
        onDidDismiss={() => setShowProfileToast(false)}
        message="Bientot disponible"
        duration={1800}
        position="top"
      />
    </>
  );
};

const App = () => {
  const [showOnboarding, setShowOnboarding] = useState(getShouldShowOnboarding);

  const handleOnboardingDone = (dontShowAgain) => {
    if (dontShowAgain) {
      try {
        localStorage.setItem(onboardingKey, "1");
      } catch {
        // no-op if storage unavailable
      }
    }
    setShowOnboarding(false);
  };

  return (
    <IonApp>
      <NetworkCheck />
      <IonReactRouter>
        <AppRoutes shouldShowOnboarding={showOnboarding} onOnboardingDone={handleOnboardingDone} />
      </IonReactRouter>
    </IonApp>
  );
};

export default App;
