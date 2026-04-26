import { useState } from "react";
import { IonContent, IonPage, IonHeader, IonToolbar, IonToast } from "@ionic/react";
import { useHistory } from "react-router-dom";

import "./HomePage.css";
import "../App.css";
import ChatMessageIcon from "../assets/icon/Chat Message.svg";
import NotificationIcon from "../assets/icon/Notification.svg";
import StudentsImage from "../assets/img/estim_girls.svg";
import PhoneMockup from "../assets/img/phone2.svg";

const quickActions = [
  { label: "Examens", route: "/examens", icon: "exam" },
  { label: "Emploi du temps", route: "/edt", icon: "schedule" },
  { label: "Annonces", route: "/annonces", icon: "megaphone" },
  { label: "Finances", route: "/ressources", icon: "wallet" },
  { label: "Presence", route: "/presence", icon: "presence" },
];

function QuickActionGlyph({ type }) {
  return (
    <span className={`quick-action-glyph quick-action-glyph-${type}`} aria-hidden="true">
      {type === "calendar" || type === "schedule" || type === "exam" ? (
        <span className="icon-calendar-shell">
          <span className="icon-ring icon-ring-left" />
          <span className="icon-ring icon-ring-right" />
        </span>
      ) : null}

      {type === "megaphone" ? (
        <span className="icon-megaphone-shell">
          <span className="icon-megaphone-body" />
          <span className="icon-megaphone-handle" />
        </span>
      ) : null}

      {type === "wallet" ? (
        <span className="icon-wallet-shell">
          <span className="icon-wallet-dot" />
        </span>
      ) : null}

      {type === "presence" ? (
        <span className="icon-presence-shell">
          <span className="icon-presence-head" />
          <span className="icon-presence-body" />
        </span>
      ) : null}
    </span>
  );
}

function HomePage() {
  const history = useHistory();
  const [showSoonToast, setShowSoonToast] = useState(false);

  const handleQuickActionClick = (action) => {
    if (action.label === "Emploi du temps" || action.label === "Annonces" || action.label === "Examens") {
      history.push(action.route);
      return;
    }
    setShowSoonToast(true);
  };

  return (
    <IonPage>
      <IonHeader className="home-page-header ion-no-border">
        <IonToolbar className="home-page-toolbar">
          <div className="edt-header">
            <div className="edt-header-left">
              <h1 className="edt-title">ESTIM</h1>
            </div>
            <div className="edt-header-right">
              <button
                className="edt-header-action"
                type="button"
                aria-label="Messages"
                onClick={() => setShowSoonToast(true)}
              >
                <span className="edt-badge">9</span>
                <img className="edt-header-icon" src={ChatMessageIcon} alt="" aria-hidden="true" />
              </button>
              <button
                className="edt-header-action"
                type="button"
                aria-label="Notifications"
                onClick={() => setShowSoonToast(true)}
              >
                <span className="edt-badge">7</span>
                <img className="edt-header-icon" src={NotificationIcon} alt="" aria-hidden="true" />
              </button>
            </div>
          </div>
        </IonToolbar>
      </IonHeader>
      <IonContent className="home-page-content">
        <div className="home-page-shell">
          <section className="home-page-hero">
            <p className="home-page-greeting">Bonjour, brillant</p>
            <p className="home-page-student">
              <span>Etudiant-e</span> d&apos;estim
            </p>
          </section>

          <section className="home-section">
            <h2 className="home-section-title">Decouvrir</h2>
            <button
              className="home-discovery-card"
              type="button"
              aria-label="Decouvrir les fonctionnalites"
              onClick={() => history.push("/apps")}
            >
              <div className="discovery-stage">
                <div className="discovery-copy">
                  <span className="discovery-pill">Annonces</span>
                </div>
                <div className="discovery-phone-wrap">
                  <img className="discovery-phone" src={PhoneMockup} alt="" aria-hidden="true" />
                </div>
                <div className="discovery-students-wrap">
                  <img className="discovery-students" src={StudentsImage} alt="Etudiantes ESTIM" />
                </div>
                <span className="discovery-circle discovery-circle-main" />
                <span className="discovery-circle discovery-circle-soft" />
              </div>
            </button>
          </section>

          <section className="home-section">
            <h2 className="home-section-title">Acces rapide</h2>
            <div className="quick-actions-grid">
              {quickActions.map((action) => (
                <button
                  key={action.label}
                  className="quick-action-card"
                  type="button"
                  onClick={() => handleQuickActionClick(action)}
                >
                  <span className="quick-action-icon">
                    <QuickActionGlyph type={action.icon} />
                  </span>
                  <span className="quick-action-label">{action.label}</span>
                </button>
              ))}
            </div>
          </section>
        </div>

        <IonToast
          isOpen={showSoonToast}
          onDidDismiss={() => setShowSoonToast(false)}
          message="Bientot disponible"
          duration={1800}
          position="top"
        />
      </IonContent>
    </IonPage>
  );
}

export default HomePage;
