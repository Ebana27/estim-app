import { useEffect, useMemo, useState } from 'react';
import {
  IonContent,
  IonIcon,
  IonPage,
  IonRefresher,
  IonRefresherContent,
} from '@ionic/react';
import { chevronDownOutline } from 'ionicons/icons';
import EstimApi from '../js/api/estimApi';
import {
  DAY_LABELS,
  DAY_ORDER,
  buildById,
  getDefaultOpenDay,
  getTodayDayKey,
  normalizeWeeklyCourses,
} from '../js/utils/weeklyEdt';
import './EdtPage.css';

const api = new EstimApi();

const uniqueValuesInOrder = (items) => {
  const seen = new Set();
  return items.filter((item) => {
    if (!item || seen.has(item)) return false;
    seen.add(item);
    return true;
  });
};

const sortLevels = (levels) => {
  return [...levels].sort((left, right) => {
    const leftRank = Number(String(left).match(/\d+/)?.[0] || Number.POSITIVE_INFINITY);
    const rightRank = Number(String(right).match(/\d+/)?.[0] || Number.POSITIVE_INFINITY);

    if (leftRank !== rightRank) return leftRank - rightRank;
    return String(left).localeCompare(String(right), 'fr');
  });
};

const readOptionalList = (result) => {
  if (result.status === 'fulfilled') return api.normalizeList(result.value);
  console.warn('Weekly EDT lookup unavailable:', result.reason);
  return [];
};

const fetchWeeklyEdtData = async () => {
  const [
    edtResult,
    classesResult,
    sallesResult,
    matieresResult,
    profsResult,
  ] = await Promise.allSettled([
    api.request('/edt'),
    api.request('/classes'),
    api.request('/salles'),
    api.request('/matieres'),
    api.request('/professeurs'),
  ]);

  if (edtResult.status !== 'fulfilled') {
    throw edtResult.reason || new Error('Impossible de charger les emplois du temps.');
  }

  const edtList = api.normalizeList(edtResult.value);
  const classesList = readOptionalList(classesResult);
  const sallesList = readOptionalList(sallesResult);
  const matieresList = readOptionalList(matieresResult);
  const profsList = readOptionalList(profsResult);

  return normalizeWeeklyCourses(edtList, {
    classesById: buildById(classesList),
    sallesById: buildById(sallesList),
    matieresById: buildById(matieresList),
    profsById: buildById(profsList),
  });
};

const EdtPage = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedFiliere, setSelectedFiliere] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('Tous');
  const [openDay, setOpenDay] = useState(getTodayDayKey());

  const loadCourses = async () => {
    setLoading(true);
    setError('');

    try {
      const nextCourses = await fetchWeeklyEdtData();
      setCourses(nextCourses);
    } catch (err) {
      console.error(err);
      setCourses([]);
      setError('Impossible de charger l’emploi du temps pour le moment.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      setLoading(true);
      setError('');

      try {
        const nextCourses = await fetchWeeklyEdtData();
        if (!isMounted) return;
        setCourses(nextCourses);
      } catch (err) {
        console.error(err);
        if (!isMounted) return;
        setCourses([]);
        setError('Impossible de charger l’emploi du temps pour le moment.');
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    load();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleRefresh = async (event) => {
    await loadCourses();
    event.detail.complete();
  };

  const filiereOptions = useMemo(() => {
    return uniqueValuesInOrder(courses.map((course) => course.filiere));
  }, [courses]);

  useEffect(() => {
    if (filiereOptions.length === 0) {
      if (selectedFiliere !== '') setSelectedFiliere('');
      return;
    }

    if (!selectedFiliere || !filiereOptions.includes(selectedFiliere)) {
      setSelectedFiliere(filiereOptions[0]);
    }
  }, [filiereOptions, selectedFiliere]);

  const coursesForSelectedFiliere = useMemo(() => {
    if (!selectedFiliere) return [];
    return courses.filter((course) => course.filiere === selectedFiliere);
  }, [courses, selectedFiliere]);

  const levelOptions = useMemo(() => {
    return sortLevels(
      uniqueValuesInOrder(coursesForSelectedFiliere.map((course) => course.level).filter(Boolean)),
    );
  }, [coursesForSelectedFiliere]);

  useEffect(() => {
    if (levelOptions.length === 0) {
      if (selectedLevel !== 'Tous') setSelectedLevel('Tous');
      return;
    }

    if (selectedLevel !== 'Tous' && !levelOptions.includes(selectedLevel)) {
      setSelectedLevel('Tous');
    }
  }, [levelOptions, selectedLevel]);

  const filteredCourses = useMemo(() => {
    if (selectedLevel === 'Tous') return coursesForSelectedFiliere;
    return coursesForSelectedFiliere.filter((course) => course.level === selectedLevel);
  }, [coursesForSelectedFiliere, selectedLevel]);

  const groupedDays = useMemo(() => {
    return DAY_ORDER.map((dayKey) => ({
      key: dayKey,
      label: DAY_LABELS[dayKey],
      courses: filteredCourses.filter((course) => course.dayKey === dayKey),
    }));
  }, [filteredCourses]);

  useEffect(() => {
    setOpenDay((current) => {
      const preferredDay = current || getTodayDayKey();
      const nextDay = getDefaultOpenDay(groupedDays, preferredDay);
      return current === nextDay ? current : nextDay;
    });
  }, [groupedDays]);

  const hasCoursesForCurrentFilters = groupedDays.some((day) => day.courses.length > 0);

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
                value={selectedFiliere}
                onChange={(event) => setSelectedFiliere(event.target.value)}
                disabled={loading || filiereOptions.length === 0}
                aria-label="Choisir une filière"
              >
                {filiereOptions.length === 0 && (
                  <option value="">
                    {loading ? 'Chargement...' : 'Aucune filière disponible'}
                  </option>
                )}
                {filiereOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              <IonIcon icon={chevronDownOutline} className="edt-select-icon" aria-hidden="true" />
            </label>

            {levelOptions.length > 0 && (
              <div className="edt-levels" aria-label="Filtrer par niveau">
                <button
                  type="button"
                  className={`edt-level-chip ${selectedLevel === 'Tous' ? 'is-active' : ''}`}
                  onClick={() => setSelectedLevel('Tous')}
                >
                  Tous
                </button>
                {levelOptions.map((level) => (
                  <button
                    key={level}
                    type="button"
                    className={`edt-level-chip ${selectedLevel === level ? 'is-active' : ''}`}
                    onClick={() => setSelectedLevel(level)}
                  >
                    {level}
                  </button>
                ))}
              </div>
            )}
          </section>

          {loading && <div className="edt-state-card">Chargement de l’emploi du temps...</div>}
          {!loading && error && <div className="edt-state-card edt-state-card--error">{error}</div>}
          {!loading && !error && !selectedFiliere && (
            <div className="edt-state-card">Aucun emploi du temps disponible.</div>
          )}
          {!loading && !error && selectedFiliere && !hasCoursesForCurrentFilters && (
            <div className="edt-state-card">Aucun cours pour cette filière.</div>
          )}

          {!error && selectedFiliere && (
            <div className="edt-days-list">
              {groupedDays.map((day) => {
                const hasCourses = day.courses.length > 0;
                const isOpen = hasCourses && openDay === day.key;

                return (
                  <section
                    key={day.key}
                    className={`edt-day-card ${isOpen ? 'is-open' : ''} ${!hasCourses ? 'is-empty' : ''}`}
                  >
                    <button
                      type="button"
                      className="edt-day-toggle"
                      onClick={() => {
                        if (hasCourses) setOpenDay(day.key);
                      }}
                      disabled={!hasCourses}
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
                              {course.room && (
                                <span className="edt-course-room"> ({course.room})</span>
                              )}
                            </p>
                            {course.teacher && (
                              <p className="edt-course-teacher">{course.teacher}</p>
                            )}
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
