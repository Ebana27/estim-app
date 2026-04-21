export const DAY_ORDER = [
  'LUNDI',
  'MARDI',
  'MERCREDI',
  'JEUDI',
  'VENDREDI',
  'SAMEDI',
  'DIMANCHE',
];

export const DAY_LABELS = {
  LUNDI: 'LUNDI',
  MARDI: 'MARDI',
  MERCREDI: 'MERCREDI',
  JEUDI: 'JEUDI',
  VENDREDI: 'VENDREDI',
  SAMEDI: 'SAMEDI',
  DIMANCHE: 'DIMANCHE',
};

const DAY_ALIASES = {
  LUN: 'LUNDI',
  LUNDI: 'LUNDI',
  MON: 'LUNDI',
  MONDAY: 'LUNDI',
  MAR: 'MARDI',
  MARDI: 'MARDI',
  TUE: 'MARDI',
  TUESDAY: 'MARDI',
  MER: 'MERCREDI',
  MERCREDI: 'MERCREDI',
  WED: 'MERCREDI',
  WEDNESDAY: 'MERCREDI',
  JEU: 'JEUDI',
  JEUDI: 'JEUDI',
  THU: 'JEUDI',
  THURSDAY: 'JEUDI',
  VEN: 'VENDREDI',
  VENDREDI: 'VENDREDI',
  FRI: 'VENDREDI',
  FRIDAY: 'VENDREDI',
  SAM: 'SAMEDI',
  SAMEDI: 'SAMEDI',
  SAT: 'SAMEDI',
  SATURDAY: 'SAMEDI',
  DIM: 'DIMANCHE',
  DIMANCHE: 'DIMANCHE',
  SUN: 'DIMANCHE',
  SUNDAY: 'DIMANCHE',
};

export const buildById = (items) => {
  if (!Array.isArray(items)) return {};
  return items.reduce((acc, item) => {
    const id = item?.uuid || item?.id;
    if (id) acc[id] = item;
    return acc;
  }, {});
};

const normalizeKey = (value) => {
  if (value == null) return '';
  return String(value)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toUpperCase();
};

export const normalizeWeekday = (value) => {
  const key = normalizeKey(value);
  return DAY_ALIASES[key] || null;
};

export const parseHourToMinutes = (value) => {
  if (value == null || value === '') return null;

  const raw = String(value).trim().toUpperCase().replace(/\s+/g, '');
  if (!raw) return null;

  const normalized = raw.replace(/H/g, ':');
  const hourMatch = normalized.match(/^(\d{1,2})(?::(\d{1,2}))?$/);
  if (!hourMatch) return null;

  const hour = Number(hourMatch[1]);
  const minute = hourMatch[2] == null ? 0 : Number(hourMatch[2]);

  if (!Number.isInteger(hour) || !Number.isInteger(minute)) return null;
  if (hour < 0 || hour > 23 || minute < 0 || minute > 59) return null;

  return (hour * 60) + minute;
};

export const formatMinutesToHourLabel = (totalMinutes) => {
  if (!Number.isFinite(totalMinutes)) return '--h--';
  const hour = Math.floor(totalMinutes / 60);
  const minute = totalMinutes % 60;
  return `${String(hour).padStart(2, '0')}h${String(minute).padStart(2, '0')}`;
};

export const formatHourRange = (startMinutes, endMinutes) => {
  if (!Number.isFinite(startMinutes) || !Number.isFinite(endMinutes)) return '';
  return `${formatMinutesToHourLabel(startMinutes)} - ${formatMinutesToHourLabel(endMinutes)}`;
};

export const extractFiliere = (classe) => {
  return (
    classe?.filiere?.sigle ||
    classe?.filiere?.nom ||
    classe?.nom ||
    null
  );
};

export const extractLevel = (classe) => {
  return (
    classe?.niveau?.code ||
    classe?.niveau?.libelle ||
    classe?.niveau?.label ||
    null
  );
};

export const enrichWeeklyEvent = (event, lookups = {}) => {
  const classesById = lookups.classesById || {};
  const sallesById = lookups.sallesById || {};
  const matieresById = lookups.matieresById || {};
  const profsById = lookups.profsById || {};

  return {
    ...event,
    classe: event?.classeId ? (classesById[event.classeId] || event?.classe) : event?.classe,
    salle: event?.salleId ? (sallesById[event.salleId] || event?.salle) : event?.salle,
    matiere: event?.matiereId ? (matieresById[event.matiereId] || event?.matiere) : event?.matiere,
    professeur: event?.professeurId ? (profsById[event.professeurId] || event?.professeur) : event?.professeur,
  };
};

export const normalizeWeeklyCourse = (event) => {
  const dayKey = normalizeWeekday(event?.jourSemaine);
  const startMinutes = parseHourToMinutes(event?.heureDebut);
  const endMinutes = parseHourToMinutes(event?.heureFin);

  if (!dayKey || startMinutes == null || endMinutes == null || endMinutes <= startMinutes) {
    return null;
  }

  const filiere = extractFiliere(event?.classe);
  const level = extractLevel(event?.classe);
  const subject = event?.matiere?.nom || event?.matiere || 'Cours';
  const room = event?.salle?.nom || event?.salle || '';
  const teacher = event?.professeur?.nom || event?.professeur || '';

  return {
    id: event?.uuid || event?.id || `${dayKey}-${startMinutes}-${subject}`,
    dayKey,
    dayLabel: DAY_LABELS[dayKey],
    startHour: startMinutes,
    endHour: endMinutes,
    timeRange: formatHourRange(startMinutes, endMinutes),
    subject,
    room,
    teacher,
    filiere: filiere || 'Non definie',
    level: level || null,
    type: event?.type || 'COURS',
  };
};

export const normalizeWeeklyCourses = (events, lookups = {}) => {
  if (!Array.isArray(events)) return [];

  return events
    .map((event) => enrichWeeklyEvent(event, lookups))
    .map(normalizeWeeklyCourse)
    .filter(Boolean)
    .sort((a, b) => {
      if (a.dayKey !== b.dayKey) {
        return DAY_ORDER.indexOf(a.dayKey) - DAY_ORDER.indexOf(b.dayKey);
      }
      if (a.startHour !== b.startHour) return a.startHour - b.startHour;
      if (a.endHour !== b.endHour) return a.endHour - b.endHour;
      return a.subject.localeCompare(b.subject, 'fr');
    });
};

export const getTodayDayKey = (date = new Date()) => {
  const index = (date.getDay() + 6) % 7;
  return DAY_ORDER[index] || DAY_ORDER[0];
};

export const getDefaultOpenDay = (groupedDays, preferredDay = getTodayDayKey()) => {
  const availableDays = (groupedDays || [])
    .filter((day) => Array.isArray(day?.courses) && day.courses.length > 0)
    .map((day) => day.key);

  if (availableDays.includes(preferredDay)) return preferredDay;
  return availableDays[0] || DAY_ORDER[0];
};
