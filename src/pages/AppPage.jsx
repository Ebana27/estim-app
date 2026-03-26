import React, { useMemo, useState } from "react";
import { useHistory } from "react-router-dom";
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonIcon,
} from "@ionic/react";
import { searchOutline, chevronForwardOutline } from "ionicons/icons";
import "./AppPage.css";

const FEATURE_SECTIONS = [
  {
    label: "ACADEMIQUE",
    items: [
      {
        title: "EMPLOI DU TEMPS",
        subtitle: "Consultez",
        buttonText: "Lire",
        bgColor: "#FFF5C7",
        btnColor: "#FFE057",
        textColor: "#ffffff",
        available: true,
        route: "/edt",
      },
      {
        title: "ABSENCES",
        subtitle: "Justifier",
        buttonText: "Voir",
        bgColor: "#FFF5C7",
        btnColor: "#FFE057",
        textColor: "#fffefe",
        available: true,
        route: "/absences",
      },
    ],
  },
  {
    label: "RESSOURCES",
    items: [
      {
        title: "BIBLIOTHEQUE",
        subtitle: "References et documents",
        buttonText: "Lire",
        bgColor: "#B6FF91",
        btnColor: "#EDFFEB",
        available: true,
        route: "/bibliotheque",
      },
      {
        title: "RESSOURCES",
        subtitle: "Cours & Docs",
        buttonText: "Ouvrir",
        bgColor: "#B5FFB9",
        btnColor: "#FFE057",
        available: true,
        route: "/ressources",
      },
    ],
  },
  {
    label: "SUIVI",
    items: [
      {
        title: "PRESENCE",
        subtitle: "Marquer Votre Presence",
        buttonText: "Scan",
        bgColor: "#FFADAD",
        btnColor: "#FF6352",
        textColor: "#fff",
        available: true,
        route: "/presence",
      },
      {
        title: "NOTES",
        subtitle: "Consultation",
        buttonText: "Voir",
        bgColor: "#FFCFC9",
        btnColor: "#FFE057",
        available: true,
        route: "/notes",
      },
    ],
  },
];

/* ================================================
   COMPOSANT REUTILISABLE : FeatureCard
   ================================================ */
const FeatureCard = ({
  title,
  subtitle,
  buttonText,
  bgColor,
  btnColor,
  textColor = "#fff",
  available = true,
  route,
  onOpen,
}) => {
  const handleClick = () => {
    if (!available || !route) return;
    onOpen(route);
  };

  return (
    <div
      className="feature-card-wrapper"
      style={{
        backgroundColor: bgColor,
        opacity: available ? 1 : 0.6,
        position: "relative",
      }}
    >
      {!available && (
        <div className="coming-soon-badge">
          Bientot disponible
        </div>
      )}

      <div className="feature-card-overlay" />

      <div className="feature-card-content">
        <div className="feature-text-block">
          <h3 className="feature-card-title" style={{ color: textColor || "#fff" }}>
            {title}
          </h3>
          <p className="feature-card-subtitle">
            {available ? subtitle : "Fonctionnalite en developpement"}
          </p>
        </div>
        <button
          type="button"
          className="feature-card-btn"
          style={{
            backgroundColor: btnColor,
            cursor: available ? "pointer" : "not-allowed",
          }}
          onClick={handleClick}
          disabled={!available}
        >
          {available ? buttonText : "Indisponible"}
          <IonIcon icon={chevronForwardOutline} className="btn-icon" />
        </button>
      </div>
    </div>
  );
};

/* ================================================
   PAGE PRINCIPALE
   ================================================ */
const AppPage = () => {
  const history = useHistory();
  const [query, setQuery] = useState("");

  const filteredSections = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return FEATURE_SECTIONS;

    return FEATURE_SECTIONS.map((section) => {
      const items = section.items.filter((item) => {
        const text = `${item.title} ${item.subtitle}`.toLowerCase();
        return text.includes(q);
      });
      return { ...section, items };
    }).filter((section) => section.items.length > 0);
  }, [query]);

  return (
    <IonPage>
      <IonHeader className="ion-no-border app-header">
        <IonToolbar>
          <IonTitle>Application</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="app-content" fullscreen>
        <div className="search-container">
          <div className="search-box">
            <IonIcon icon={searchOutline} className="search-icon" />
            <input
              type="text"
              placeholder="Rechercher une fonctionnalite"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        </div>

        {filteredSections.map((section) => (
          <section key={section.label} className="app-section">
            <h2 className="section-label">{section.label}</h2>
            <div className="cards-scroll">
              {section.items.map((item) => (
                <FeatureCard
                  key={item.title}
                  title={item.title}
                  subtitle={item.subtitle}
                  buttonText={item.buttonText}
                  bgColor={item.bgColor}
                  btnColor={item.btnColor}
                  textColor={item.textColor}
                  available={item.available}
                  route={item.route}
                  onOpen={(route) => history.push(route)}
                />
              ))}
            </div>
            <div className="scroll-indicator">
              {section.items.map((item, index) => (
                <span
                  key={`${item.title}-${index}`}
                  className={`dot ${index === 0 ? "active" : ""}`}
                />
              ))}
            </div>
          </section>
        ))}
      </IonContent>
    </IonPage>
  );
};

export default AppPage;
