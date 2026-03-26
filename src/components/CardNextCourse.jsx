/* src\components\CardNextCourse.jsx */
import { IonIcon } from '@ionic/react';
import { calculatorOutline, timeOutline, locationOutline } from 'ionicons/icons';
import './CardNextCourse.css';

// CARD pour la section "Prochains cours" de la HomePage
const CardNextCourse = ({ courseName, courseTime, courseLocation, isOngoing = false }) => {
  return (
    <div className="card-next-course">
      <div className="card-body">
        <div className="card-top-row">
          <h3 className="card-title">{courseName}</h3>
          {isOngoing && <span className="card-status-badge">En cours</span>}
        </div>
        <div className="card-meta">
          <div className="card-meta-row">
            <IonIcon icon={timeOutline} />
            {courseTime}
          </div>
          <div className="card-meta-row">
            <IonIcon icon={locationOutline} />
            {courseLocation}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardNextCourse;