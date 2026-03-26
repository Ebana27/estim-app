import { useEffect, useState } from "react";
import {
  IonContent,
  IonHeader,
  IonIcon,
  IonPage,
  IonToolbar,
} from "@ionic/react";
import { Browser } from "@capacitor/browser";
import { useHistory } from "react-router-dom";
import { notificationsOutline, timeOutline, locationOutline } from "ionicons/icons";
import UpdateModal from "../components/UpdateModal";
import useVersionCheck from "../hooks/useVersionCheck";
import EstimApi from "../api/estimApi";
import { mapApiAdToAnnouncement, mapApiEdtToCourse } from "../utils/estimMappers";
import "./HomePage.css";
import heroImage from "../assets/img/Hero.png";

const api = new EstimApi();
const fallbackAdImage =
  "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=500&q=60";
const fallbackAnnouncement = {
  title: "ESTIM APP",
  body: "Decouvrir l'application creee par un etudiant pour des etudiants....",
  image: fallbackAdImage,
};
const fallbackCourse = {
  title: "ANGLAIS",
  timeRange: "09H00 - 10H30",
  salle: "Salle : Martin Luther King",
};

const HomePage = () => {
  const { isUpdateOpen, closeUpdate, remoteInfo } = useVersionCheck();
  const history = useHistory();
  const [latestAd, setLatestAd] = useState(null);
  const [nextCourse, setNextCourse] = useState(null);
  const [loadingAd, setLoadingAd] = useState(true);
  const [loadingCourse, setLoadingCourse] = useState(true);

  const handleDownload = async () => {
    const url = remoteInfo?.downloadUrl;
    if (!url) return;
    try {
      await Browser.open({ url });
    } catch (err) {
      console.error("Browser open error:", err);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const loadAds = async () => {
      try {
        const list = await api.getAd();
        const mapped = list.map((ad) => mapApiAdToAnnouncement(ad, fallbackAdImage));
        if (isMounted) setLatestAd(mapped[0] || null);
      } catch (err) {
        console.error("Erreur chargement annonces:", err);
      } finally {
        if (isMounted) setLoadingAd(false);
      }
    };

    const loadEdt = async () => {
      try {
        const list = await api.getEdt();
        const mapped = list.map((evt) => mapApiEdtToCourse(evt));
        const now = new Date();
        const upcoming = mapped
          .filter((c) => c?.rawDate && new Date(c.rawDate) >= now)
          .sort((a, b) => new Date(a.rawDate) - new Date(b.rawDate));
        const fallback = mapped
          .filter((c) => c?.rawDate)
          .sort((a, b) => new Date(a.rawDate) - new Date(b.rawDate));

        if (isMounted) setNextCourse(upcoming[0] || fallback[0] || null);
      } catch (err) {
        console.error("Erreur chargement EDT:", err);
      } finally {
        if (isMounted) setLoadingCourse(false);
      }
    };

    loadAds();
    loadEdt();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <IonPage>
      <IonHeader className="ion-no-border home-header">
        <IonToolbar>
          <div className="header-inner">
            <div className="header-brand">
              <img
                src="/src/assets/icon/icon40x40.svg"
                alt="ESTIM Logo"
                className="header-logo"
              />
              <div>
                <p className="header-brand-name">ESTIM</p>
                <p className="header-brand-sub">TECH &amp; MANAGEMENT</p>
              </div>
            </div>

            <button className="header-notif-btn" aria-label="Notifications">
              <IonIcon icon={notificationsOutline} />
              <span className="notif-dot" />
            </button>
          </div>
        </IonToolbar>
      </IonHeader>

      <IonContent className="home-content">
        <div className="hero-container">
          <img
            src={heroImage}
            alt="Bienvenue sur l'application ESTIM"
            className="hero-full-image"
          />
        </div>

        <section className="section">
          <div className="section-header">
            <div>
              <h2 className="section-title">Dernieres annonces</h2>
              <p className="section-subtitle">Annonces les plus recentes</p>
            </div>
            <button className="section-more" onClick={() => history.push("/annonces")}>
              Plus
            </button>
          </div>

          <div className="announce-card">
            {loadingAd && !latestAd ? (
              <div className="announce-image announce-loading">Chargement...</div>
            ) : (
              <img
                src={(latestAd || fallbackAnnouncement).image}
                alt="ESTIM App"
                className="announce-image"
              />
            )}
            <div className="announce-body">
              <div className="announce-text">
                <p className="announce-title">
                  {(latestAd || fallbackAnnouncement).title}
                </p>
                <p className="announce-desc">
                  {(latestAd || fallbackAnnouncement).body}
                </p>
              </div>
              <button className="announce-btn" onClick={() => history.push("/annonces")}>
                Lire
              </button>
            </div>
          </div>
        </section>

        <section className="section">
          <div className="section-header">
            <div>
              <h2 className="section-title-upper">PROCHAINS COURS</h2>
              <p className="section-subtitle">Decouvrez vos cours</p>
            </div>
          </div>

          <div className="course-card">
            <div className="course-top">
              <p className="course-name">
                {(nextCourse || fallbackCourse).title}
              </p>
              <img
                src="/src/assets/icon/icon40x40.svg"
                alt="Logo ESTIM"
                className="course-logo"
              />
            </div>

            <div className="course-info-row">
              <IonIcon icon={timeOutline} className="course-icon" />
              <span className="course-info-text">
                {loadingCourse && !nextCourse
                  ? "Chargement..."
                  : (nextCourse || fallbackCourse).timeRange}
              </span>
            </div>

            <div className="course-info-row">
              <IonIcon icon={locationOutline} className="course-icon" />
              <span className="course-info-text">
                {loadingCourse && !nextCourse
                  ? "Chargement..."
                  : (nextCourse || fallbackCourse).salle}
              </span>
            </div>
          </div>
        </section>

        <div style={{ height: 32 }} />
      </IonContent>

      <UpdateModal
        isOpen={isUpdateOpen}
        onClose={closeUpdate}
        onDownload={handleDownload}
        remoteVersion={remoteInfo?.version}
        notes={remoteInfo?.notes}
      />
    </IonPage>
  );
};

export default HomePage;
