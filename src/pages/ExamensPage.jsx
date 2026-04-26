import { useEffect, useMemo, useState } from "react";
import {
  IonContent,
  IonHeader,
  IonLabel,
  IonPage,
  IonSegment,
  IonSegmentButton,
  IonSearchbar,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import EstimApi from "../js/api/estimApi";
import { formatDateShortFr, formatTimeFr } from "../js/utils/estimMappers";
import "./FeatureListPage.css";
import "./ExamensPage.css";

const api = new EstimApi();

const getItemTitle = (item) => item?.titre || item?.title || item?.nom || item?.name || "Element";
const getItemBody = (item) => item?.description || item?.body || item?.resume || item?.details || item?.contenu || "";
const getItemDate = (item) => item?.date || item?.createdAt || item?.publishAt || item?.updatedAt || item?.startAt || null;
const getItemMeta = (item) => item?.status || item?.etat || item?.type || item?.categorie || item?.category || "";

const loadListWithFallback = async (endpoints) => {
  for (const endpoint of endpoints) {
    try {
      const payload = await api.request(endpoint);
      if (payload?.ok === false) continue;
      return api.normalizeList(payload);
    } catch {
      // try next endpoint
    }
  }
  return [];
};

const ExamensPage = () => {
  const [segment, setSegment] = useState("session");
  const [query, setQuery] = useState("");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const endpoints = useMemo(() => {
    if (segment === "devoirs") return ["/devoirs"];
    return ["/examens", "/notes"];
  }, [segment]);

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const list = await loadListWithFallback(endpoints);
        if (isMounted) setItems(list);
      } catch (err) {
        console.error("Erreur chargement:", err);
        if (isMounted) setError("Impossible de charger les resultats");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    load();
    return () => {
      isMounted = false;
    };
  }, [endpoints]);

  const mapped = useMemo(() => {
    return items.map((item, index) => {
      const date = getItemDate(item);
      return {
        id: item?.uuid || item?.id || `${getItemTitle(item)}-${date || index}`,
        title: getItemTitle(item),
        body: getItemBody(item),
        meta: getItemMeta(item),
        dateLabel: date ? `${formatTimeFr(date)} | ${formatDateShortFr(date)}` : "",
      };
    });
  }, [items]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return mapped;

    return mapped.filter((item) => {
      const haystack = `${item.title} ${item.body} ${item.meta} ${item.dateLabel}`.toLowerCase();
      return haystack.includes(q);
    });
  }, [mapped, query]);

  const emptyLabel = segment === "devoirs" ? "Aucun devoir" : "Aucun resultat";
  const emptySearchLabel = "Aucun resultat pour cette recherche";

  return (
    <IonPage>
      <IonHeader className="ion-no-border examens-header">
        <IonToolbar className="examens-toolbar">
          <IonTitle>Examens</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="feature-content">
        <p className="feature-subtitle">Resultats de session et devoirs</p>

        <div className="examens-search">
          <IonSearchbar
            value={query}
            onIonInput={(e) => setQuery(e.detail.value || "")}
            placeholder="Rechercher..."
            className="examens-searchbar"
          />
        </div>

        <IonSegment
          value={segment}
          onIonChange={(e) => {
            if (e.detail.value) setSegment(e.detail.value);
          }}
        >
          <IonSegmentButton value="session">
            <IonLabel>Session</IonLabel>
          </IonSegmentButton>
          <IonSegmentButton value="devoirs">
            <IonLabel>Devoirs</IonLabel>
          </IonSegmentButton>
        </IonSegment>

        {loading && <div className="feature-state">Chargement...</div>}
        {!loading && error && <div className="feature-state feature-error">{error}</div>}
        {!loading && !error && mapped.length === 0 && <div className="feature-state">{emptyLabel}</div>}
        {!loading && !error && mapped.length > 0 && filtered.length === 0 && (
          <div className="feature-state">{emptySearchLabel}</div>
        )}

        <div className="feature-list">
          {filtered.map((item) => (
            <article key={item.id} className="feature-card">
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

export default ExamensPage;
