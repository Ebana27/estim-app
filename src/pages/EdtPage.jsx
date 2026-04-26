import { useEffect, useMemo, useState } from "react";
import { IonContent, IonIcon, IonPage, IonRefresher, IonRefresherContent } from "@ionic/react";
import { chevronDownOutline } from "ionicons/icons";
import EstimApi from "../js/api/estimApi";
import { buildById, DAY_ORDER, getDefaultOpenDay, normalizeWeeklyCourses } from "../js/utils/weeklyEdt";
import "./EdtPage.css";

const api = new EstimApi();
const ALL_LEVELS_OPTION = "Tous";
const LEVEL_ORDER = ["L1", "L2", "L3", "L4", "M1", "M2"];

const uniq = (items) => [...new Set((items || []).filter(Boolean))];

const orderLevels = (levels) => {
  const unique = uniq(levels);
  return unique.sort((a, b) => {
    const aIndex = LEVEL_ORDER.indexOf(a);
    const bIndex = LEVEL_ORDER.indexOf(b);
    if (aIndex !== -1 || bIndex !== -1) {
      return (aIndex === -1 ? Number.POSITIVE_INFINITY : aIndex) - (bIndex === -1 ? Number.POSITIVE_INFINITY : bIndex);
    }
    return a.localeCompare(b, "fr");
  });
};

const unwrapList = async (path) => {
  const payload = await api.request(path);
  if (payload?.ok === false) {
    throw new Error(payload?.message || `Erreur API (${path})`);
  }
  return api.normalizeList(payload);
};

const buildFiliereLevelIndex = ({ classes = [], courses = [] }) => {
  const filiereLevels = new Map();

  const add = (filiere, level) => {
    if (!filiere) return;
    if (!filiereLevels.has(filiere)) filiereLevels.set(filiere, new Set());
    if (level) filiereLevels.get(filiere).add(level);
  };

  classes.forEach((classe) => {
    const filiere = classe?.filiere?.sigle || classe?.filiere?.nom || classe?.nom || null;
    const level = typeof classe?.niveau === "string" ? classe.niveau : (classe?.niveau?.code || null);
    add(filiere, level);
  });

  courses.forEach((course) => {
    add(course?.filiere, course?.level);
  });

  const filieres = Array.from(filiereLevels.keys()).sort((a, b) => a.localeCompare(b, "fr"));
  const filieresWithLevels = filieres.filter((f) => (filiereLevels.get(f)?.size || 0) > 0);

  return { filiereLevels, filieres, filieresWithLevels };
};

const groupCoursesByDay = (courses) => {
  const byDay = new Map();
  (courses || []).forEach((course) => {
    if (!course?.dayKey) return;
    if (!byDay.has(course.dayKey)) byDay.set(course.dayKey, []);
    byDay.get(course.dayKey).push(course);
  });

  return DAY_ORDER.map((dayKey) => {
    const dayCourses = (byDay.get(dayKey) || []).slice().sort((a, b) => a.startHour - b.startHour);
    return { key: dayKey, label: dayKey, courses: dayCourses };
  });
};

const EdtPage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [events, setEvents] = useState([]);
  const [lookups, setLookups] = useState({ classesById: {}, sallesById: {}, matieresById: {}, profsById: {} });

  const [selectedFiliere, setSelectedFiliere] = useState("");
  const [selectedLevel, setSelectedLevel] = useState(ALL_LEVELS_OPTION);
  const [openDay, setOpenDay] = useState("");

  const loadData = async () => {
    setLoading(true);
    setError("");

    try {
      const [edt, classes, matieres, salles, professeurs] = await Promise.all([
        unwrapList("/edt"),
        unwrapList("/classes").catch(() => []),
        unwrapList("/matieres").catch(() => []),
        unwrapList("/salles").catch(() => []),
        unwrapList("/professeurs").catch(() => []),
      ]);

      setEvents(edt);
      setLookups({
        classesById: buildById(classes),
        sallesById: buildById(salles),
        matieresById: buildById(matieres),
        profsById: buildById(professeurs),
      });
    } catch (err) {
      console.error(err);
      setEvents([]);
      setLookups({ classesById: {}, sallesById: {}, matieresById: {}, profsById: {} });
      setError("Impossible de charger l'emploi du temps pour le moment.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleRefresh = async (event) => {
    await loadData();
    event.detail.complete();
  };

  const weeklyCourses = useMemo(() => normalizeWeeklyCourses(events, lookups), [events, lookups]);

  const { filiereLevels, filieres, filieresWithLevels } = useMemo(() => {
    const classes = Object.values(lookups?.classesById || {});
    return buildFiliereLevelIndex({ classes, courses: weeklyCourses });
  }, [lookups, weeklyCourses]);

  const canUseLevels = filieresWithLevels.length > 0;

  const availableLevelsForSelectedFiliere = useMemo(() => {
    return orderLevels(Array.from(filiereLevels.get(selectedFiliere) || []));
  }, [filiereLevels, selectedFiliere]);

  const levelOptions = useMemo(() => {
    if (!canUseLevels) return [];
    return [ALL_LEVELS_OPTION, ...availableLevelsForSelectedFiliere];
  }, [availableLevelsForSelectedFiliere, canUseLevels]);

  useEffect(() => {
    if (filieres.length === 0) {
      setSelectedFiliere("");
      return;
    }

    const defaultFiliere = filieresWithLevels[0] || filieres[0];
    if (!selectedFiliere || !filieres.includes(selectedFiliere)) {
      setSelectedFiliere(defaultFiliere);
      setSelectedLevel(ALL_LEVELS_OPTION);
      return;
    }

    if (!canUseLevels) return;

    const selectedLevels = filiereLevels.get(selectedFiliere);
    const hasLevels = (selectedLevels?.size || 0) > 0;
    if (!hasLevels) {
      setSelectedFiliere(defaultFiliere);
      setSelectedLevel(ALL_LEVELS_OPTION);
    }
  }, [canUseLevels, filiereLevels, filieres, filieresWithLevels, selectedFiliere]);

  useEffect(() => {
    if (!canUseLevels) return;
    if (!levelOptions.includes(selectedLevel)) setSelectedLevel(ALL_LEVELS_OPTION);
  }, [canUseLevels, levelOptions, selectedLevel]);

  const filteredCourses = useMemo(() => {
    if (!selectedFiliere) return [];
    if (!canUseLevels) return [];

    let filtered = weeklyCourses.filter((course) => course.filiere === selectedFiliere);
    if (canUseLevels && selectedLevel !== ALL_LEVELS_OPTION) {
      filtered = filtered.filter((course) => course.level === selectedLevel);
    }
    return filtered;
  }, [canUseLevels, selectedFiliere, selectedLevel, weeklyCourses]);

  const groupedDays = useMemo(() => groupCoursesByDay(filteredCourses), [filteredCourses]);
  const hasCourses = groupedDays.some((day) => day.courses.length > 0);

  useEffect(() => {
    setOpenDay((previous) => {
      const available = groupedDays.filter((day) => day.courses.length > 0).map((day) => day.key);
      if (previous && available.includes(previous)) return previous;
      return getDefaultOpenDay(groupedDays);
    });
  }, [groupedDays]);

  return (
    <IonPage>
      <IonContent className="edt-content" fullscreen>
        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent />
        </IonRefresher>

        <div className="edt-shell">
          <header className="edt-header">
            <h1 className="edt-title">Emploi du Temps</h1>
          </header>

          <section className="edt-toolbar" aria-label="Filtres emploi du temps">
            <label className="edt-select-card" htmlFor="edt-filiere-select">
              <span className="edt-select-prefix">Filière:</span>
              <select
                id="edt-filiere-select"
                className="edt-select-control"
                aria-label="Choisir une filière"
                value={selectedFiliere}
                onChange={(e) => setSelectedFiliere(e.target.value)}
                disabled={loading || filieres.length === 0}
              >
                {filieres.length === 0 && <option value="">{loading ? "Chargement..." : "Aucune filière"}</option>}
                {filieres.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              <IonIcon icon={chevronDownOutline} className="edt-select-icon" aria-hidden="true" />
            </label>

            <label className="edt-select-card" htmlFor="edt-level-select">
              <span className="edt-select-prefix">Niveau:</span>
              <select
                id="edt-level-select"
                className="edt-select-control"
                aria-label="Choisir un niveau"
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                disabled={loading || !canUseLevels || levelOptions.length === 0}
              >
                {!canUseLevels && <option value={ALL_LEVELS_OPTION}>{ALL_LEVELS_OPTION}</option>}
                {canUseLevels &&
                  levelOptions.map((level) => (
                    <option key={level} value={level}>
                      {level}
                    </option>
                  ))}
              </select>
              <IonIcon icon={chevronDownOutline} className="edt-select-icon" aria-hidden="true" />
            </label>
          </section>

          {loading && <div className="edt-state-card">Chargement...</div>}
          {!loading && error && <div className="edt-state-card edt-state-card--error">{error}</div>}
          {!loading && !error && selectedFiliere && !hasCourses && (
            <div className="edt-state-card">Aucun cours pour cette filière.</div>
          )}

          {!loading && !error && selectedFiliere && (
            <div className="edt-days-list">
              {groupedDays.map((day) => {
                const isNotEmpty = day.courses.length > 0;
                const isOpen = isNotEmpty && openDay === day.key;

                return (
                  <section
                    key={day.key}
                    className={`edt-day-card ${isOpen ? "is-open" : ""} ${!isNotEmpty ? "is-empty" : ""}`}
                  >
                    <button
                      type="button"
                      className="edt-day-toggle"
                      onClick={() => {
                        if (isNotEmpty) setOpenDay(day.key);
                      }}
                      disabled={!isNotEmpty}
                      aria-expanded={isOpen}
                    >
                      <span className="edt-day-name">{day.label}</span>
                    </button>

                    {isOpen && (
                      <div className="edt-day-body">
                        {day.courses.map((course) => (
                          <article key={course.id} className="edt-course-row">
                            <p className="edt-course-line">
                              <span className="edt-course-time">{course.timeRange}</span>
                              <span className="edt-course-separator"> : </span>
                              <span className="edt-course-subject">{course.subject}</span>
                              {course.room && <span className="edt-course-room"> ({course.room})</span>}
                            </p>
                            {course.teacher && <p className="edt-course-teacher">{course.teacher}</p>}
                          </article>
                        ))}
                      </div>
                    )}
                  </section>
                );
              })}
            </div>
          )}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default EdtPage;
