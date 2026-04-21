import { useEffect, useMemo, useState } from "react";
import {
  IonContent,
  IonHeader,
  IonPage,
  IonToolbar,
  IonTitle,
} from "@ionic/react";
import EstimApi from "../js/api/estimApi";
import { formatDateShortFr, formatTimeFr } from "../js/utils/estimMappers";
import "./FeatureListPage.css";

const api = new EstimApi();

const getItemTitle = (item) =>
  item?.titre || item?.title || item?.nom || item?.name || "Element";

const getItemBody = (item) =>
  item?.description || item?.body || item?.resume || item?.details || item?.contenu || "";

const getItemDate = (item) =>
  item?.date || item?.createdAt || item?.publishAt || item?.updatedAt || item?.startAt || null;

const getItemMeta = (item) =>
  item?.status || item?.etat || item?.type || item?.categorie || item?.category || "";

const getItemImage = (item) => item?.imageUrl || item?.image || null;

const FeatureListPage = ({ title, subtitle, endpoint, emptyLabel }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const list = await api.request(endpoint);
        const normalized = api.normalizeList(list);
        if (isMounted) setItems(normalized);
      } catch (err) {
        console.error("Erreur chargement:", err);
        if (isMounted) setError("Impossible de charger les donnees");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    load();
    return () => {
      isMounted = false;
    };
  }, [endpoint]);

  const mapped = useMemo(() => {
    return items.map((item, index) => {
      const date = getItemDate(item);
      return {
        id: item?.uuid || item?.id || `${getItemTitle(item)}-${date || index}`,
        title: getItemTitle(item),
        body: getItemBody(item),
        meta: getItemMeta(item),
        dateLabel: date ? `${formatTimeFr(date)} | ${formatDateShortFr(date)}` : "",
        image: getItemImage(item),
      };
    });
  }, [items]);

  return (
    <IonPage>
      <IonHeader className="ion-no-border feature-header">
        <IonToolbar>
          <IonTitle>{title}</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="feature-content">
        {subtitle && <p className="feature-subtitle">{subtitle}</p>}

        {loading && <div className="feature-state">Chargement...</div>}
        {!loading && error && <div className="feature-state feature-error">{error}</div>}
        {!loading && !error && mapped.length === 0 && (
          <div className="feature-state">{emptyLabel || "Aucune donnee"}</div>
        )}

        <div className="feature-list">
          {mapped.map((item) => (
            <article key={item.id} className="feature-card">
              {item.image && (
                <div className="feature-card-image">
                  <img src={item.image} alt={item.title} />
                </div>
              )}
              <div className="feature-card-body">
                <div className="feature-card-top">
                  <h3 className="feature-card-title">{item.title}</h3>
                  {item.meta && <span className="feature-card-meta">{item.meta}</span>}
                </div>
                {item.body && <p className="feature-card-desc">{item.body}</p>}
                {item.dateLabel && <div className="feature-card-date">{item.dateLabel}</div>}
              </div>
            </article>
          ))}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default FeatureListPage;

