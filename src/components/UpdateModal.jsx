import { IonModal } from "@ionic/react";
import "./UpdateModal.css";

const UpdateModal = ({ isOpen, onClose, onDownload, remoteVersion, notes }) => {
  return (
    <IonModal isOpen={isOpen} onDidDismiss={onClose} className="update-modal">
      <div className="update-modal__content">
        <h2 className="update-modal__title">Nouvelle version disponible</h2>
        <p className="update-modal__subtitle">
          {remoteVersion
            ? `Une nouvelle version (${remoteVersion}) est prête.`
            : "Une nouvelle version est prête."}
        </p>
        {notes && <p className="update-modal__notes">{notes}</p>}
        <div className="update-modal__actions">
          <button className="update-btn update-btn--primary" onClick={onDownload}>
            Télécharger
          </button>
          <button className="update-btn update-btn--ghost" onClick={onClose}>
            Plus tard
          </button>
        </div>
      </div>
    </IonModal>
  );
};

export default UpdateModal;
