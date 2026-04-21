/* src/utils/estimMappers.js */

export const formatDateShortFr = (value) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

export const formatTimeFr = (value) => {
  if (!value) return "--:--";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "--:--";
  return date.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
};

export const formatTimeRangeFr = (start, durationMs = 5400000) => {
  if (!start) return "--:--";
  const s = new Date(start);
  if (Number.isNaN(s.getTime())) return "--:--";
  const e = new Date(s.getTime() + durationMs);
  return `${formatTimeFr(s)} - ${formatTimeFr(e)}`;
};

export const mapApiAdToAnnouncement = (ad, fallbackImage) => {
  return {
    id: ad?.uuid || ad?.id,
    title: ad?.titre || ad?.title || "Annonce",
    body: ad?.description || ad?.body || "",
    category: ad?.categorie || ad?.category || "Academique",
    date: formatDateShortFr(ad?.publishAt || ad?.date),
    time: formatTimeFr(ad?.publishAt || ad?.date),
    isNew: ad?.isNew || false,
    image: ad?.imageUrl || ad?.image || fallbackImage,
  };
};

export const mapApiEdtToCourse = (evt) => {
  const matiere = evt?.matiere?.nom || evt?.matiere || evt?.title || "Cours";
  const prof = evt?.professeur?.nom || evt?.professeur || evt?.prof;
  const salle = evt?.salle?.nom || evt?.salle || evt?.room;
  const rawDate = evt?.dateHeure || evt?.startAt || evt?.date;
  const level =
    evt?.classe?.niveau?.code ||
    evt?.classe?.niveau?.libelle ||
    evt?.classe?.niveau?.label ||
    undefined;
  const filiere =
    evt?.classe?.filiere?.sigle ||
    evt?.classe?.filiere?.nom ||
    evt?.classe?.nom ||
    undefined;

  return {
    id: evt?.uuid || evt?.id || `${matiere}-${rawDate}`,
    time: formatTimeFr(rawDate),
    timeRange: formatTimeRangeFr(rawDate),
    title: matiere,
    prof,
    salle,
    rawDate,
    level,
    filiere,
    typeLabel: evt?.type || evt?.typeLabel,
    typeKey: String(evt?.type || evt?.typeLabel || '').toLowerCase(),
    campusId: evt?.campusId || evt?.campus?.uuid || evt?.campus?.id,
    semestreId: evt?.semestreId || evt?.semestre?.uuid || evt?.semestre?.id,
    classeId: evt?.classeId || evt?.classe?.uuid || evt?.classe?.id,
    salleId: evt?.salleId || evt?.salle?.uuid || evt?.salle?.id,
    matiereId: evt?.matiereId || evt?.matiere?.uuid || evt?.matiere?.id,
    professeurId: evt?.professeurId || evt?.professeur?.uuid || evt?.professeur?.id,
    campus: evt?.campus,
    semestre: evt?.semestre,
    classe: evt?.classe,
    matiere: evt?.matiere,
    professeur: evt?.professeur,
    salleObj: evt?.salle,
  };
};
