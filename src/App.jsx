/* src\App.jsx */
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
import { homeOutline, appsOutline, megaphoneOutline } from "ionicons/icons";

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

setupIonicReact();

const App = () => (
  <IonApp>
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

export default App;
