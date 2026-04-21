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

// ──────────────────────────────────────────────────────────────────
// Images Unsplash – une image pertinente par fonctionnalité
// ──────────────────────────────────────────────────────────────────
const IMAGES = {
  // Académique
  EDT:         "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=400&q=70",   // calendrier / agenda
  ABSENCES:    "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&q=70",   // salle de classe vide

  // Ressources
  BIBLIO:      "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&q=70",   // bibliothèque
  RESSOURCES:  "https://images.unsplash.com/photo-1513258496099-48168024aec0?w=400&q=70",   // documents / cours

  // Suivi
  PRESENCE:    "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=70",   // scan / pointage
  NOTES:       "https://images.unsplash.com/photo-1588072432836-e10032774350?w=400&q=70",   // notes / résultats

  // Communauté
  BDE:         "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400&q=70",   // groupe d'étudiants
  CHAT:        "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400&q=70",      // discussion / chat
};

const FEATURE_SECTIONS = [
  {
    label: "ACADEMIQUE",
    items: [
      {
        title: "EMPLOI DU TEMPS",
        subtitle: "Consultez votre planning",
        buttonText: "Consulter",
        bgColor: "#b8860b",
        btnColor: "#FFE057",
        btnTextColor: "#333",
        image: IMAGES.EDT,
        available: true,
        route: "/edt",
      },
      {
        title: "ABSENCES",
        subtitle: "Justifier vos absences",
        buttonText: "Voir",
        bgColor: "#8a6500",
        btnColor: "#FFE057",
        btnTextColor: "#333",
        image: IMAGES.ABSENCES,
        available: false,
        route: "/absences",
      },
    ],
  },
  {
    label: "RESSOURCES",
    items: [
      {
        title: "BIBLIOTHÈQUE",
        subtitle: "Références et documents",
        buttonText: "Lire",
        bgColor: "#1a7a34",
        btnColor: "#fff",
        btnTextColor: "#1a7a34",
        image: IMAGES.BIBLIO,
        available: false,
        route: "/bibliotheque",
      },
      {
        title: "RESSOURCES",
        subtitle: "Cours & documents",
        buttonText: "Ouvrir",
        bgColor: "#15622a",
        btnColor: "#fff",
        btnTextColor: "#1a7a34",
        image: IMAGES.RESSOURCES,
        available: false,
        route: "/ressources",
      },
    ],
  },
  {
    label: "SUIVI",
    items: [
      {
        title: "PRÉSENCE",
        subtitle: "Marquer votre présence",
        buttonText: "Scan",
        bgColor: "#b03030",
        btnColor: "#FF6352",
        btnTextColor: "#fff",
        image: IMAGES.PRESENCE,
        available: false,
        route: "/presence",
      },
      {
        title: "NOTES",
        subtitle: "Consulter vos résultats",
        buttonText: "Voir",
        bgColor: "#8a2020",
        btnColor: "#FF6352",
        btnTextColor: "#fff",
        image: IMAGES.NOTES,
        available: false,
        route: "/notes",
      },
    ],
  },
  {
    label: "COMMUNAUTÉ",
    items: [
      {
        title: "BDE",
        subtitle: "Déposer vos plaintes",
        buttonText: "Déposer",
        bgColor: "#1a5fa0",
        btnColor: "#52b1ff",
        btnTextColor: "#fff",
        image: IMAGES.BDE,
        available: false,
        route: "/bde",
      },
      {
        title: "ESTIM CHAT",
        subtitle: "Chater avec la communauté",
        buttonText: "Chater",
        bgColor: "#154d82",
        btnColor: "#52b1ff",
        btnTextColor: "#fff",
        image: IMAGES.CHAT,
        available: false,
        route: "/estim-chat",
      },
    ],
  },
];

/* ================================================
   COMPOSANT : FeatureCard  (carte carrée)
   ================================================ */
const FeatureCard = ({
  title,
  subtitle,
  buttonText,
  bgColor,
  btnColor,
  btnTextColor,
  image,
  available = true,
  route,
  onOpen,
  onUnavailable,
}) => {
  const handleClick = () => {
    if (!available || !route) {
      if (!available && onUnavailable) onUnavailable();
      return;
    }
    onOpen(route);
  };

  return (
    <div className="feature-card" onClick={handleClick}>

      {/* ── Image de fond (peu opaque) ── */}
      <img src={image} alt={title} className="feature-card-bg" />

      {/* ── Couche de couleur par-dessus l'image ── */}
      <div
        className="feature-card-color-layer"
        style={{ background: bgColor }}
      />

      {/* ── Dégradé sombre en bas pour lisibilité ── */}
      <div className="feature-card-fade" />

      {/* ── Badge "bientôt disponible" ── */}
      {!available && (
        <div className="coming-soon-badge">Bientôt disponible</div>
      )}

      {/* ── Contenu texte + bouton ── */}
      <div className="feature-card-content">
        <div className="feature-text-block">
          <h3 className="feature-card-title">{title}</h3>
          <p className="feature-card-subtitle">
            {available ? subtitle : "Fonctionnalité en développement"}
          </p>
        </div>
        <button
          type="button"
          className="feature-card-btn"
          style={{
            backgroundColor: btnColor,
            color: btnTextColor || "#333",
            cursor: available ? "pointer" : "not-allowed",
          }}
          onClick={(e) => { e.stopPropagation(); handleClick(); }}
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
  const [isNoticeOpen, setIsNoticeOpen] = useState(false);

  const openNotice = () => setIsNoticeOpen(true);
  const closeNotice = () => setIsNoticeOpen(false);

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

        {/* ── Barre de recherche ── */}
        <div className="search-container">
          <div className="search-box">
            <IonIcon icon={searchOutline} className="search-icon" />
            <input
              type="text"
              placeholder="Rechercher une fonctionnalité"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        </div>

        {/* ── Sections avec cartes carrées ── */}
        {filteredSections.map((section) => (
          <section key={section.label} className="app-section">

            {/* Titre de la section */}
            <h2 className="section-label">{section.label}</h2>

            {/* Rangée de cartes scrollable */}
            <div className="cards-scroll">
              {section.items.map((item) => (
                <FeatureCard
                  key={item.title}
                  {...item}
                  onOpen={(route) => history.push(route)}
                  onUnavailable={openNotice}
                />
              ))}
            </div>

            {/* Points indicateurs */}
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

        <div style={{ height: 32 }} />

        {isNoticeOpen && (
          <div className="feature-notice-modal">
            <button className="feature-notice-backdrop" onClick={closeNotice} aria-label="Fermer" />
            <div className="feature-notice-card" role="dialog" aria-modal="true">
              <h3>Information</h3>
              <p>Pas encore disponible sur les fonctionnalités en développement.</p>
              <button type="button" className="feature-notice-close" onClick={closeNotice}>Fermer</button>
            </div>
          </div>
        )}
      </IonContent>
    </IonPage>
  );
};

export default AppPage;
