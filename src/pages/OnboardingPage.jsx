import { useState } from "react";
import { IonPage, IonContent } from "@ionic/react";
import { useHistory } from "react-router-dom";
import "./OnboardingPage.css";

import studentSvg from "../assets/img/students.png";
import heroPng from "../assets/img/edt_image.png";
import heroSvg from "../assets/img/ad_image.png";

const slides = [
  {
    id: 1,
    image: studentSvg,
    imageClass: "ob-img--students",
    title: "ESTIM APP",
    description: "Ressources academiques et actualites, centralisees pour vous.",
    btn: "Suivant",
  },
  {
    id: 2,
    image: heroPng,
    imageClass: "ob-img--mockup",
    title: "EMPLOI DU TEMPS",
    description:
      "Votre planning universitaire, toujours a portee de main. Recevez des alertes pour ne manquer aucun cours.",
    btn: "Suivant",
  },
  {
    id: 3,
    image: heroSvg,
    imageClass: "ob-img--mockup",
    title: "ANNONCES",
    description:
      "Toute l'actualite de l'institut, en temps reel. Recevez les notifications officielles pour ne rien manquer du campus.",
    btn: "Demarrer",
  },
];

const OnboardingPage = ({ onDone }) => {
  const [current, setCurrent] = useState(0);
  const [dontShowAgain, setDontShowAgain] = useState(false);
  const history = useHistory();

  const finish = () => {
    if (onDone) onDone(dontShowAgain);
    history.replace("/home");
  };

  const goNext = () => {
    if (current < slides.length - 1) {
      setCurrent((prev) => prev + 1);
    } else {
      finish();
    }
  };

  const goPrev = () => {
    if (current > 0) setCurrent((prev) => prev - 1);
  };

  const slide = slides[current];

  return (
    <IonPage>
      <IonContent scrollY={false} className="ob-content">
        <div className="ob-screen">
          {/* Top bar: compteur + fleches */}
          <div className="ob-topbar">
            <span className="ob-counter">
              {current + 1}/{slides.length}
            </span>
            <div className="ob-top-actions">
              <div className="ob-arrows">
                <button
                  className="ob-arrow"
                  onClick={goPrev}
                  disabled={current === 0}
                  aria-label="Precedent"
                >
                  {"<"}
                </button>
                <button className="ob-arrow" onClick={goNext} aria-label="Suivant">
                  {">"}
                </button>
              </div>
              <button className="ob-skip" onClick={finish}>
                Passer
              </button>
            </div>
          </div>

          {/* Zone visuelle */}
          <div className="ob-visual">
            <div className="ob-blob" />
            <img src={slide.image} alt={slide.title} className={`ob-img ${slide.imageClass}`} />
            <div className="ob-fade" />
          </div>

          {/* Texte + bouton */}
          <div className="ob-body">
            <h1 className="ob-title">{slide.title}</h1>
            <p className="ob-desc">{slide.description}</p>
            <button className="ob-btn" onClick={goNext}>
              {slide.btn}
            </button>
            <label className="ob-checkbox">
              <input
                type="checkbox"
                checked={dontShowAgain}
                onChange={() => setDontShowAgain((prev) => !prev)}
              />
              <span>Ne plus afficher</span>
            </label>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default OnboardingPage;
