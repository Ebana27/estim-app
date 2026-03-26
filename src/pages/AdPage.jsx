import { useEffect, useMemo, useState } from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonToolbar,
  IonSearchbar,
  IonIcon,
} from '@ionic/react';
import { closeOutline, checkmarkCircleOutline } from 'ionicons/icons';

import studentImage from '../assets/img/student.svg';
import EstimApi from '../api/estimApi';
import { mapApiAdToAnnouncement } from '../utils/estimMappers';
import './AdPage.css';

const api = new EstimApi();
const CACHE_KEY = 'estim_ads_cache';

// --- Données fictives (Fallback ultime) ---
const fallbackImage = studentImage;
const mockAnnouncements = [
  {
    id: 1,
    title: 'ESTIM APP',
    body: "Découvrir l'application créer par un étudiant pour des étudiants...",
    category: 'Evenement',
    date: '16 Mars 2026',
    time: '10h23',
    isNew: true,
    image: fallbackImage,
  },
  {
    id: 2,
    title: 'Carte Étudiante',
    body: "Après plusieurs mois d'attente dus à des problèmes techniques, ESTIM lance enfin les cartes étudiantes.",
    category: 'Administratif',
    date: '10 mars 2026',
    time: '09h00',
    isNew: true,
    image: fallbackImage,
  },
  // ... (ajoute les autres mocks si nécessaire)
];

const categories = ['Tout', 'Academique', 'Administratif', 'Evenement'];

const categoryColors = {
  'Academique': { bg: '#117a2a18', color: '#117a2a' },
  'Administratif': { bg: '#e67e2218', color: '#e67e22' },
  'Evenement': { bg: '#ffd03630', color: '#b8860b' },
};

const categoryLabels = {
  Tout: 'Tout',
  Academique: 'Académique',
  Administratif: 'Administratif',
  Evenement: 'Événement',
};

// --- Helpers ---
const mapAd = (ad) => mapApiAdToAnnouncement(ad, fallbackImage);

// --- Composants ---

const AnnouncementCard = ({ item, onClick }) => {
  const colors = categoryColors[item.category] || { bg: '#eee', color: '#555' };

  return (
    <button className="ann-card" onClick={() => onClick(item)}>
      {item.isNew && <span className="ann-badge-new">Nouveau</span>}
      
      <div className="ann-cover">
        <img className="ann-cover-img" src={item.image} alt={item.title} />
      </div>

      <div className="ann-card-body">
        <h3 className="ann-title">{item.title}</h3>
        <p className="ann-body">{item.body}</p>
        
        <div className="ann-footer">
          <div className="ann-date">
            <span>{item.time} | {item.date}</span>
          </div>
          <div className="ann-read-more">
            Lire
          </div>
        </div>
      </div>
    </button>
  );
};

const AnnouncementModal = ({ item, onClose }) => {
  if (!item) return null;

  // Contenu spécifique pour la démonstration ESTIM APP (selon l'image)
  const isEstimApp = item.title.includes('ESTIM APP');
  const features = [
    "Lecture D'emploi Du Temps",
    "Annonce & Evenements",
    "Présence Par Scan De Qr Code",
    "Bibliothèque Numérique"
  ];

  return (
    <div className="ann-modal-overlay" onClick={onClose}>
      <div className="ann-modal-sheet" onClick={(e) => e.stopPropagation()}>
        <div className="ann-modal-header">
          <div className="ann-modal-handle" />
          <button className="ann-modal-close" onClick={onClose}>
            <IonIcon icon={closeOutline} />
          </button>
        </div>

        <div className="ann-modal-content">
          <h2 className="ann-modal-title">{item.title}</h2>
          <p className="ann-modal-desc">
            {isEstimApp 
              ? "Cette application a été conçue par un étudiant pour des étudiants. Elle est prestée efficacement pour satisfaire vos besoins." 
              : item.body
            }
          </p>

          {isEstimApp && (
            <div className="ann-modal-features">
              {features.map((feat, i) => (
                <div key={i} className="ann-modal-feature-item">
                  <IonIcon icon={checkmarkCircleOutline} className="feature-icon" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          )}

          <div className="ann-modal-date">
            {item.time} | {item.date}
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Page Principale ---

const AdPage = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('Tout');
  const [search, setSearch] = useState('');
  const [selectedAd, setSelectedAd] = useState(null);

  // 1. Chargement initial (Cache puis API)
  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      // A. Essayer de charger le cache immédiatement
      try {
        const cached = localStorage.getItem(CACHE_KEY);
        if (cached) {
          const parsed = JSON.parse(cached);
          if (isMounted) setAnnouncements(parsed);
        }
      } catch (e) {
        console.warn('Erreur lecture cache', e);
      }

      // B. Appel API
      try {
        const list = await api.getAd();
        const mapped = list.map(mapAd);
        if (isMounted) {
          setAnnouncements(mapped);
          // Sauvegarder dans le cache
          localStorage.setItem(CACHE_KEY, JSON.stringify(mapped));
        }
      } catch (err) {
        console.error('Échec API Annonces', err);
        // Si pas de cache et erreur, on utilise les mocks
        if (isMounted && announcements.length === 0) {
          setAnnouncements(mockAnnouncements);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadData();

    return () => { isMounted = false; };
  }, []);

  // 2. Filtres
  const filtered = useMemo(() => {
    return announcements.filter((a) => {
      const matchCat = activeCategory === 'Tout' || a.category === activeCategory;
      const text = `${a.title} ${a.body}`.toLowerCase();
      const matchSearch = text.includes(search.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [announcements, activeCategory, search]);

  const newCount = announcements.filter((a) => a.isNew).length;

  return (
    <IonPage>
      <IonHeader className="ion-no-border tab3-header">
        <IonToolbar>
          <div className="tab3-toolbar-inner">
            <h1 className="tab3-title">Annonces</h1>
            <p className="tab3-subtitle">{newCount} nouvelles annonces</p>
          </div>
        </IonToolbar>
      </IonHeader>

      <IonContent className="tab3-content">
        {/* Searchbar */}
        <div className="search-container">
          <IonSearchbar
            value={search}
            onIonInput={(e) => setSearch(e.detail.value)}
            placeholder="Rechercher une fonctionnalité"
            className="tab3-searchbar"
          />
        </div>

        {/* Filtres catégories */}
        <div className="tab3-filters">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`tab3-filter-btn ${activeCategory === cat ? 'tab3-filter-btn--active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {categoryLabels[cat] || cat}
            </button>
          ))}
        </div>

        {/* Liste des annonces */}
        <div className="ann-list">
          {loading && announcements.length === 0 && (
            <div className="ann-loading">Chargement...</div>
          )}
          
          {filtered.map((a) => (
            <AnnouncementCard key={a.id} item={a} onClick={setSelectedAd} />
          ))}
        </div>

        {/* Modal Détail */}
        {selectedAd && (
          <AnnouncementModal item={selectedAd} onClose={() => setSelectedAd(null)} />
        )}
      </IonContent>
    </IonPage>
  );
};

export default AdPage;
