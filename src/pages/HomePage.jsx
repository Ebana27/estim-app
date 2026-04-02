import { useEffect, useRef, useState } from "react";
import {
  IonContent,
  IonHeader,
  IonIcon,
  IonPage,
  IonToolbar,
} from "@ionic/react";
import { Browser } from "@capacitor/browser";
import {
  chevronBackOutline,
  chevronForwardOutline,
  notificationsOutline,
} from "ionicons/icons";
import UpdateModal from "../components/UpdateModal";
import useVersionCheck from "../hooks/useVersionCheck";
import "./HomePage.css";
import heroImage from "../assets/img/Hero.png";
import logoIcon from "../assets/icon/icon40x40.svg";
import gallery2025 from "../assets/img/gallery/estim-5.jpg";
import gallery2024 from "../assets/img/gallery/estim-4.jpg";
import gallery2023 from "../assets/img/gallery/estim-3.jpg";
import gallery2022 from "../assets/img/gallery/estim-2.jpg";
import gallery2021 from "../assets/img/gallery/estim-1.jpg";

const galleryItems = [
  { year: 2025, title: "ESTIM 2025", src: gallery2025 },
  { year: 2024, title: "ESTIM 2024", src: gallery2024 },
  { year: 2023, title: "ESTIM 2023", src: gallery2023 },
  { year: 2022, title: "ESTIM 2022", src: gallery2022 },
  { year: 2021, title: "ESTIM 2021", src: gallery2021 },
];

const HomePage = () => {
  const { isUpdateOpen, closeUpdate, remoteInfo } = useVersionCheck();
  const galleryRef = useRef(null);
  const rafRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const handleDownload = async () => {
    const url = remoteInfo?.downloadUrl;
    if (!url) return;
    try {
      await Browser.open({ url });
    } catch (err) {
      console.error("Browser open error:", err);
    }
  };

  const scrollToIndex = (index) => {
    const container = galleryRef.current;
    if (!container) return;
    const items = container.querySelectorAll(".gallery-item");
    const target = items[index];
    if (!target) return;
    container.scrollTo({
      left: target.offsetLeft - (container.clientWidth - target.clientWidth) / 2,
      behavior: "smooth",
    });
  };

  const handlePrev = () => {
    const nextIndex = Math.max(0, activeIndex - 1);
    scrollToIndex(nextIndex);
  };

  const handleNext = () => {
    const nextIndex = Math.min(galleryItems.length - 1, activeIndex + 1);
    scrollToIndex(nextIndex);
  };

  const handleScroll = () => {
    const container = galleryRef.current;
    if (!container) return;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      const items = Array.from(container.querySelectorAll(".gallery-item"));
      if (!items.length) return;
      const center = container.scrollLeft + container.clientWidth / 2;
      let closest = 0;
      let minDistance = Number.POSITIVE_INFINITY;
      items.forEach((item, index) => {
        const itemCenter = item.offsetLeft + item.clientWidth / 2;
        const distance = Math.abs(center - itemCenter);
        if (distance < minDistance) {
          minDistance = distance;
          closest = index;
        }
      });
      setActiveIndex(closest);
    });
  };

  useEffect(() => {
    scrollToIndex(0);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <IonPage>
      <IonHeader className="ion-no-border home-header">
        <IonToolbar>
          <div className="header-inner">
            <div className="header-brand">
              <img
                src={logoIcon}
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
              <h2 className="section-title">Galerie ESTIM</h2>
              <p className="section-subtitle">
                Les 5 precedentes annees en images
              </p>
            </div>
          </div>

          <div className="gallery-wrap">
            <div className="gallery-scroll" ref={galleryRef} onScroll={handleScroll}>
              {galleryItems.map((item, index) => (
                <div className="gallery-item" key={item.year}>
                  <img
                    src={item.src}
                    alt={item.title}
                    className="gallery-image"
                    loading={index === 0 ? "eager" : "lazy"}
                  />
                  <div className="gallery-overlay" />
                  <div className="gallery-caption">
                    <p className="gallery-year">{item.year}</p>
                    <p className="gallery-title">{item.title}</p>
                  </div>
                </div>
              ))}
            </div>

            <button
              className="gallery-nav gallery-nav-left"
              onClick={handlePrev}
              aria-label="Precedent"
            >
              <IonIcon icon={chevronBackOutline} />
            </button>
            <button
              className="gallery-nav gallery-nav-right"
              onClick={handleNext}
              aria-label="Suivant"
            >
              <IonIcon icon={chevronForwardOutline} />
            </button>
          </div>

          <div className="gallery-dots">
            {galleryItems.map((item, index) => (
              <span
                key={item.year}
                className={`gallery-dot ${index === activeIndex ? "active" : ""}`}
              />
            ))}
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
