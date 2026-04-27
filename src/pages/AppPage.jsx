import React, { useMemo, useState } from "react";
import { useHistory } from "react-router-dom";
import { IonContent, IonPage, IonToast } from "@ionic/react";
import {
  MdAccountCircle,
  MdArrowForward,
  MdCalendarMonth,
  MdCampaign,
  MdChatBubbleOutline,
  MdPayments,
  MdHowToReg,
  MdSchedule,
  MdSchool,
} from "react-icons/md";

import "./AppPage.css";

const APPS = [
  {
    key: "calendar",
    title: "Calendrier",
    description: "Événements et dates clés.",
    icon: MdCalendarMonth,
    route: "/calendar",
    available: false,
    image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&q=80",
  },
  {
    key: "edt",
    title: "Emploi du temps",
    description: "Votre planning de cours.",
    icon: MdSchedule,
    route: "/edt",
    available: true,
    image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=400&q=80",
  },
  {
    key: "annonces",
    title: "Annonces",
    description: "Les dernières nouvelles.",
    icon: MdCampaign,
    route: "/annonces",
    available: true,
    image: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=400&q=80",
  },
  {
    key: "examens",
    title: "Examens",
    description: "Sujets et résultats.",
    icon: MdSchool,
    route: "/examens",
    available: true,
    image: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=400&q=80",
  },
  {
    key: "chat",
    title: "Chat",
    description: "Échangez avec tous.",
    icon: MdChatBubbleOutline,
    route: "/estim-chat",
    available: false,
    image: "https://images.unsplash.com/photo-1611606063065-ee7946f0787a?w=400&q=80",
  },
  {
    key: "finances",
    title: "Finances",
    description: "Gérez vos paiements.",
    icon: MdPayments,
    route: "/finances",
    available: false,
    image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&q=80",
  },
  {
    key: "presence",
    title: "Présence",
    description: "Suivez vos cours.",
    icon: MdHowToReg,
    route: "/presence",
    available: false,
    image: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=400&q=80",
  },
  {
    key: "profil",
    title: "Profil",
    description: "Vos informations.",
    icon: MdAccountCircle,
    route: "/profile",
    available: false,
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80",
  },
];

const AppTile = ({ item, onOpen, onUnavailable }) => {
  const Icon = item.icon || MdSchedule;
  const disabled = !item.available || !item.route;

  const className = [
    "apps-tile",
    disabled ? "is-disabled" : "",
  ].join(" ");

  // Style inline pour injecter dynamiquement l'image de fond
  const backgroundStyle = item.image
    ? { backgroundImage: `url(${item.image})` }
    : {};

  return (
    <button
      type="button"
      className={className}
      style={backgroundStyle}
      onClick={() => {
        if (disabled) onUnavailable();
        else onOpen(item.route);
      }}
    >
      {disabled ? (
        <span className="apps-soon">Bientôt</span>
      ) : (
        <span className="apps-cta" aria-hidden="true">
          <MdArrowForward />
        </span>
      )}

      <span className="apps-icon" aria-hidden="true">
        <Icon />
      </span>
      
      <div className="apps-text">
        <h3 className="apps-title">{item.title}</h3>
        <p className="apps-desc">{item.description}</p>
      </div>
    </button>
  );
};

const AppPage = () => {
  const history = useHistory();
  const [showSoonToast, setShowSoonToast] = useState(false);
  const tiles = useMemo(() => APPS, []);

  return (
    <IonPage>
      <IonContent className="apps-content" fullscreen>
        <div className="apps-shell">
          <h1 className="apps-page-title">Toutes les Apps</h1>

          <section className="apps-grid" aria-label="Applications">
            {tiles.map((item) => (
              <AppTile
                key={item.key}
                item={item}
                onOpen={(route) => history.push(route)}
                onUnavailable={() => setShowSoonToast(true)}
              />
            ))}
          </section>
        </div>

        <IonToast
          isOpen={showSoonToast}
          onDidDismiss={() => setShowSoonToast(false)}
          message="Bientôt disponible"
          duration={1800}
          position="top"
          color="medium"
        />
      </IonContent>
    </IonPage>
  );
};

export default AppPage;