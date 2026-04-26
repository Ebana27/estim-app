import { useEffect, useMemo, useState } from 'react';
import { LocalNotifications } from '@capacitor/local-notifications';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonRefresher,
  IonRefresherContent,
  IonToolbar,
  IonSearchbar,
} from '@ionic/react';
import { MdCampaign, MdCheckCircle, MdClose, MdEvent, MdFolder, MdMenuBook } from 'react-icons/md';

import EstimApi from '../js/api/estimApi';
import { mapApiAdToAnnouncement } from '../js/utils/estimMappers';
import './AdPage.css';

const api = new EstimApi();
const CACHE_KEY = 'estim_ads_cache';
const ADS_NOTIFIED_KEY = 'estim_ads_notified';

// --- Données fictives (Fallback ultime) ---
const fallbackImage = '/favicon.png';
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
const isFallbackAnnouncementImage = (image) => {
  if (!image) return true;
  return image === fallbackImage;
};

const shouldShowModalImage = (item) => {
  return Boolean(item?.image) && !isFallbackAnnouncementImage(item.image);
};

const getCategoryIcon = (category) => {
  switch (category) {
    case 'Academique':
      return MdMenuBook;
    case 'Administratif':
      return MdFolder;
    case 'Evenement':
      return MdEvent;
    default:
      return MdCampaign;
  }
};

const getChipColors = (category) => {
  return categoryColors[category] || { bg: 'rgba(18, 18, 18, 0.06)', color: '#121212' };
};

const requestAdNotificationPermission = async () => {
  try {
    await LocalNotifications.requestPermissions();
    return true;
  } catch (err) {
    console.warn('LocalNotifications permission error:', err);
    return false;
  }
};

const loadNotifiedAds = () => {
  try {
    const raw = localStorage.getItem(ADS_NOTIFIED_KEY);
    if (!raw) return new Set();
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return new Set(parsed);
  } catch (err) {
    console.warn('Ads notified cache read error', err);
  }
  return new Set();
};

const saveNotifiedAds = (set) => {
  try {
    localStorage.setItem(ADS_NOTIFIED_KEY, JSON.stringify(Array.from(set)));
  } catch (err) {
    console.warn('Ads notified cache write error', err);
  }
};

const scheduleAdNotifications = async (list) => {
  if (!Array.isArray(list) || list.length === 0) return;
  const ok = await requestAdNotificationPermission();
  if (!ok) return;

  const base = Date.now() + 1500;
  const notifications = list.map((ad, index) => ({
    id: Math.abs((ad?.id || index).toString().split('').reduce((acc, ch) => acc + ch.charCodeAt(0), 0)) + base + index,
    title: ad?.title || 'Nouvelle annonce',
    body: (ad?.body || '').slice(0, 120),
    schedule: { at: new Date(base + index * 1000) },
  }));

  try {
    await LocalNotifications.schedule({ notifications });
  } catch (err) {
    console.warn('LocalNotifications schedule error:', err);
  }
};

// --- Composants ---

const AnnouncementCard = ({ item, onClick }) => {
  const CategoryIcon = getCategoryIcon(item?.category);
  const chip = getChipColors(item?.category);
  const chipLabel = categoryLabels[item?.category] || item?.category || 'Annonce';

  return (
    <button className="ann-card" onClick={() => onClick(item)}>
      {item.isNew && <span className="ann-badge-new">Nouveau</span>}
      
      <div className="ann-thumb">
        <img className="ann-thumb-img" src={item.image} alt={item.title} />
      </div>

      <div className="ann-main">
        <h3 className="ann-title">{item.title}</h3>
        <p className="ann-body">{item.body}</p>

        <div className="ann-meta-row">
          <div className="ann-chip" style={{ background: chip.bg, color: chip.color }}>
            <span className="ann-chip-icon" aria-hidden="true">
              <CategoryIcon />
            </span>
            <span className="ann-chip-label">{chipLabel}</span>
          </div>
          <div className="ann-date">
            <span>{item.time} | {item.date}</span>
          </div>
        </div>
      </div>
    </button>
  );
};

const AnnouncementModal = ({ item, onClose }) => {
  if (!item) return null;

  const isEstimApp = item.title.includes('ESTIM APP');
  const hasModalImage = shouldShowModalImage(item);
  const CategoryIcon = getCategoryIcon(item?.category);
  const chip = getChipColors(item?.category);
  const chipLabel = categoryLabels[item?.category] || item?.category || 'Annonce';
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
          <button className="ann-modal-close" onClick={onClose} aria-label="Fermer">
            <MdClose />
          </button>
        </div>

        {hasModalImage && (
          <div className="ann-modal-media">
            <img className="ann-modal-image" src={item.image} alt={item.title} />
          </div>
        )}

        {!hasModalImage && (
          <div className="ann-modal-placeholder" aria-hidden="true">
            <img className="ann-modal-placeholder-img" src={fallbackImage} alt="" />
          </div>
        )}

        <div className={`ann-modal-content ${hasModalImage ? 'ann-modal-content--with-image' : ''}`}>
          <div className="ann-modal-chip" style={{ background: chip.bg, color: chip.color }}>
            <span className="ann-chip-icon" aria-hidden="true">
              <CategoryIcon />
            </span>
            <span className="ann-chip-label">{chipLabel}</span>
          </div>
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
                  <MdCheckCircle className="feature-icon" />
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

  const loadAnnouncements = async ({ isMounted = () => true, skipCache = false } = {}) => {
    if (!skipCache) {
      try {
        const cached = localStorage.getItem(CACHE_KEY);
        if (cached) {
          const parsed = JSON.parse(cached);
          if (Array.isArray(parsed) && isMounted()) {
            setAnnouncements(parsed);
          }
        }
      } catch (e) {
        console.warn('Erreur lecture cache', e);
      }
    }

    let cachedIds = new Set();
    let notifiedIds = loadNotifiedAds();
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed)) {
          cachedIds = new Set(parsed.map((item) => item?.id).filter(Boolean));
        }
      }
    } catch (e) {
      console.warn('Erreur lecture cache', e);
    }

    try {
      const list = await api.getAd();
      const mapped = list.map(mapAd);
      const newOnes = mapped.filter((ad) => {
        const isNew = ad?.isNew === true || !cachedIds.has(ad?.id);
        return isNew && !notifiedIds.has(ad?.id);
      });

      if (newOnes.length > 0) {
        await scheduleAdNotifications(newOnes);
        newOnes.forEach((ad) => notifiedIds.add(ad?.id));
        saveNotifiedAds(notifiedIds);
      }

      if (isMounted()) {
        setAnnouncements(mapped);
        localStorage.setItem(CACHE_KEY, JSON.stringify(mapped));
      }
      return mapped;
    } catch (err) {
      console.error('Échec API Annonces', err);
      if (isMounted() && !localStorage.getItem(CACHE_KEY)) {
        setAnnouncements(mockAnnouncements);
      }
      return [];
    }
  };

  // 1. Chargement initial (Cache puis API)
  useEffect(() => {
    let mounted = true;

    const loadData = async () => {
      setLoading(true);
      try {
        await loadAnnouncements({ isMounted: () => mounted });
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadData();

    return () => { mounted = false; };
  }, []);

  const handleRefresh = async (event) => {
    try {
      await loadAnnouncements({ skipCache: true });
    } finally {
      event.detail.complete();
    }
  };

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
        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent />
        </IonRefresher>

        {/* Searchbar */}
        <div className="search-container">
          <IonSearchbar
            value={search}
            onIonInput={(e) => setSearch(e.detail.value)}
            placeholder="Rechercher une annonce"
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
