/* src\components\AnnouncementCard.jsx */
import './AnnouncementCard.css';

// CARD pour la section "Dernières annonces" de la HomePage
const AnnouncementCard = ({ imageLink, title, date, content, category = 'Actualité' }) => {
  return (
    <div className="announcement-card">
      <div className="announcement-img-wrap">
        <img src={imageLink} alt="illustration de l'annonce" />
      </div>
      <div className="announcement-body">
        <div className="announcement-meta-row">
          <span className="announcement-category">{category}</span>
          <span className="announcement-date">{date}</span>
        </div>
        <h3 className="announcement-title">{title}</h3>
        <p className="announcement-content">{content}</p>
        <button className="announcement-read-btn">En savoir plus</button>
      </div>
    </div>
  );
};

export default AnnouncementCard;