import React, { useMemo, useState } from "react";
import { useHistory } from "react-router-dom";
import { IonContent, IonHeader, IonPage, IonToast, IonToolbar } from "@ionic/react";
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

import StudentsImage from "../assets/img/students.png";
import "./AppPage.css";

const APPS = [
  {
    key: "calendar",
    title: "Calendrier",
    description: "Consultez vos événements et emplois du temps.",
    icon: MdCalendarMonth,
    route: "/edt",
    available: true,
    variant: "accent",
    size: "hero",
  },
  {
    key: "hero-image",
    kind: "image",
    image: StudentsImage,
    alt: "Illustration ESTIM",
    size: "hero",
  },
  {
    key: "edt",
    title: "Emploi du temps",
    description: "Accédez à votre planning de cours.",
    icon: MdSchedule,
    route: "/edt",
    available: true,
  },
  {
    key: "annonces",
    title: "Annonces",
    description: "Restez informé des dernières nouvelles.",
    icon: MdCampaign,
    route: "/annonces",
    available: true,
  },
  {
    key: "examens",
    title: "Examens",
    description: "Consultez vos examens et résultats.",
    icon: MdSchool,
    route: "/examens",
    available: true,
  },
  {
    key: "chat",
    title: "Chat",
    description: "Discutez avec vos camarades et enseignants.",
    icon: MdChatBubbleOutline,
    route: "/estim-chat",
    available: false,
    span: 2,
  },
  {
    key: "finances",
    title: "Finances",
    description: "Gérez vos paiements.",
    icon: MdPayments,
    route: "/finances",
    available: false,
  },
  {
    key: "presence",
    title: "Présence",
    description: "Suivez vos présences.",
    icon: MdHowToReg,
    route: "/presence",
    available: false,
  },
  {
    key: "profil",
    title: "Profil",
    description: "Gérez vos informations personnelles.",
    icon: MdAccountCircle,
    route: "/profile",
    available: false,
    span: 2,
  },
];

const AppTile = ({ item, onOpen, onUnavailable }) => {
  if (item.kind === "image") {
    return (
      <div className="apps-hero-image" aria-label={item.alt}>
        <img className="apps-hero-image-img" src={item.image} alt={item.alt} />
      </div>
    );
  }

  const Icon = item.icon || MdSchedule;
  const isHero = item.size === "hero";
  const disabled = !item.available || !item.route;
  const className = [
    "apps-tile",
    isHero ? "apps-tile--hero" : "apps-tile--mini",
    item.variant === "accent" ? "apps-tile--accent" : "",
    item.span === 2 ? "apps-tile--span2" : "",
    disabled ? "is-disabled" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      type="button"
      className={className}
      onClick={() => {
        if (disabled) onUnavailable();
        else onOpen(item.route);
      }}
    >
      {!item.available && <span className="apps-soon">Bientôt</span>}
      <span className="apps-icon" aria-hidden="true">
        <Icon />
      </span>
      <div className="apps-text">
        <h3 className="apps-title">{item.title}</h3>
        <p className="apps-desc">{item.description}</p>
      </div>
      <span className="apps-cta" aria-hidden="true">
        <MdArrowForward />
      </span>
    </button>
  );
};

const AppPage = () => {
  const history = useHistory();
  const [showSoonToast, setShowSoonToast] = useState(false);
  const tiles = useMemo(() => APPS, []);

  return (
    <IonPage>
      <IonHeader className="ion-no-border apps-header">
        <IonToolbar className="apps-toolbar">
          <div className="apps-toolbar-inner">
            <h1 className="apps-page-title">Toutes les Apps</h1>
          </div>
        </IonToolbar>
      </IonHeader>

      <IonContent className="apps-content" fullscreen>
        <div className="apps-shell">
          <section className="apps-hero-grid" aria-label="Raccourcis principaux">
            {tiles
              .filter((item) => item.size === "hero")
              .map((item) => (
                <AppTile
                  key={item.key}
                  item={item}
                  onOpen={(route) => history.push(route)}
                  onUnavailable={() => setShowSoonToast(true)}
                />
              ))}
          </section>

          <section className="apps-grid" aria-label="Applications">
            {tiles
              .filter((item) => item.size !== "hero")
              .map((item) => (
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
          message="Bientot disponible"
          duration={1800}
          position="top"
        />
      </IonContent>
    </IonPage>
  );
};

export default AppPage;
