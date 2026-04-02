import { useEffect, useMemo, useState } from 'react';
import { IonContent, IonPage, IonIcon } from '@ionic/react';
import { ellipsisVertical, timeOutline, locationOutline } from 'ionicons/icons';
import EstimApi from '../api/estimApi';
import { mapApiEdtToCourse } from '../utils/estimMappers';
import './EdtPage.css';

const api = new EstimApi();

// --- Helpers & Config ---
const days = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];

const startOfWeekMonday = (date) => {
  const d = new Date(date);
  const day = (d.getDay() + 6) % 7;
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - day);
  return d;
};

const isSameDay = (a, b) => {
  if (!a || !b) return false;
  const da = new Date(a);
  const db = new Date(b);
  return da.getFullYear() === db.getFullYear() && da.getMonth() === db.getMonth() && da.getDate() === db.getDate();
};

const mapCourse = (evt) => mapApiEdtToCourse(evt);
const buildById = (items) => {
  if (!Array.isArray(items)) return {};
  return items.reduce((acc, item) => {
    const id = item?.uuid || item?.id;
    if (id) acc[id] = item;
    return acc;
  }, {});
};

const EdtPage = () => {
  const todayIndex = (new Date().getDay() + 6) % 7;
  const [activeDay, setActiveDay] = useState(todayIndex);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  // États filtres (simplifiés pour l'exemple)
  const [selectedLevel, setSelectedLevel] = useState('L1');
  const [selectedType, setSelectedType] = useState('Cours');
  const [selectedFiliere, setSelectedFiliere] = useState('all');

  const weekDates = useMemo(() => {
    const monday = startOfWeekMonday(new Date());
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      return d;
    });
  }, []);

  const dates = useMemo(() => weekDates.map((d) => d.getDate()), [weekDates]);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    Promise.all([
      api.getEdt(),
      api.getCampus(),
      api.getSemestres(),
      api.getClasses(),
      api.getSalles(),
      api.getMatieres(),
      api.getProfesseurs(),
    ])
      .then(([edtList, campusList, semestresList, classesList, sallesList, matieresList, profsList]) => {
        if (!isMounted) return;
        const campusById = buildById(campusList);
        const semestresById = buildById(semestresList);
        const classesById = buildById(classesList);
        const sallesById = buildById(sallesList);
        const matieresById = buildById(matieresList);
        const profsById = buildById(profsList);

        const enriched = (edtList || []).map((evt) => ({
          ...evt,
          campus: evt?.campusId ? campusById[evt.campusId] : evt?.campus,
          semestre: evt?.semestreId ? semestresById[evt.semestreId] : evt?.semestre,
          classe: evt?.classeId ? classesById[evt.classeId] : evt?.classe,
          salle: evt?.salleId ? sallesById[evt.salleId] : evt?.salle,
          matiere: evt?.matiereId ? matieresById[evt.matiereId] : evt?.matiere,
          professeur: evt?.professeurId ? profsById[evt.professeurId] : evt?.professeur,
        }));

        setCourses(enriched.map(mapCourse));
      })
      .catch(console.error)
      .finally(() => { if (isMounted) setLoading(false) });
    return () => { isMounted = false; };
  }, []);

  const selectedDate = weekDates[activeDay];

  const dailyCourses = useMemo(() => {
    if (!selectedDate) return [];
    return courses
      .filter((course) => isSameDay(course.rawDate, selectedDate))
      .sort((a, b) => new Date(a.rawDate) - new Date(b.rawDate));
  }, [courses, selectedDate]);

  return (
    <IonPage>
      <IonContent className="edt-content">
        
        {/* ══════════════════════════════════
            HEADER (Titre + Menu)
        ══════════════════════════════════ */}
        <div className="edt-header">
            <div className="edt-header-left">
                <h1 className="edt-title">Emploi du temps</h1>
            </div>
            <div className="edt-header-right">
                {/* Menu points verticaux */}
                <button className="edt-menu-btn">
                    <IonIcon icon={ellipsisVertical} />
                </button>
            </div>
        </div>

        {/* ══════════════════════════════════
            SÉLECTEUR DE SEMAINE
        ══════════════════════════════════ */}
        <div className="edt-week-selector">
          <div className="edt-week-container">
            {days.map((day, i) => (
              <div key={i} className="edt-day-col">
                <span className="edt-day-label">{day}</span>
                <button
                  className={`edt-day-num ${activeDay === i ? 'is-active' : ''}`}
                  onClick={() => setActiveDay(i)}
                >
                  {dates[i]}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* ══════════════════════════════════
            CONTENU PRINCIPAL (Time + Cards)
        ══════════════════════════════════ */}
        <div className="edt-body">
            
            {/* -- Bouton Filtrer (Flottant Jaune) -- */}
            <button className="edt-filter-float-btn" onClick={() => setIsFilterOpen(true)}>
                <span>Filtrer</span>
                <div className="edt-filter-bars">
                    <span /><span /><span />
                </div>
            </button>

            {/* -- Timeline Container -- */}
            <div className="edt-timeline-wrapper">
                {/* Barre de temps gauche */}
                <div className="edt-time-rail">
                    <div className="edt-time-marker">07H30</div>
                    <div className="edt-time-marker">09H00</div>
                    <div className="edt-time-marker">10H30</div>
                    <div className="edt-time-marker">12H00</div>
                </div>

                {/* Liste des cours */}
                <div className="edt-courses-list">
                    {loading && <div className="edt-loading">Chargement...</div>}
                    
                    {!loading && dailyCourses.map((course, index) => (
                        <div key={course.id} className="edt-card-wrapper">
                            {/* Point vert actif si premier cours */}
                            {index === 0 && <div className="edt-active-dot" />}
                            
                            <div className="edt-course-card">
                                <div className="edt-card-header">
                                    <span className="edt-card-time">{course.timeRange}</span>
                                    <span className="edt-card-type">{course.typeLabel}</span>
                                </div>
                                <h3 className="edt-card-title">{course.title}</h3>
                                <div className="edt-card-info">
                                    <div className="edt-info-item">
                                        <IonIcon icon={timeOutline} />
                                        <span>{course.time}</span>
                                    </div>
                                    <div className="edt-info-item">
                                        <IonIcon icon={locationOutline} />
                                        <span>{course.salle || 'Salle non définie'}</span>
                                    </div>
                                </div>
                                <div className="edt-card-prof">
                                    {course.prof}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>

        {/* ══════════════════════════════════
            MODAL FILTRES (Garde ton ancien code modal ici)
        ══════════════════════════════════ */}
        {isFilterOpen && (
             <div id="plan-filter-modal" className="estim-plan-filter">
             <button
               id="plan-filter-backdrop"
               className="estim-plan-filter__backdrop"
               onClick={() => setIsFilterOpen(false)}
             />
             <section className="estim-plan-filter__panel">
                {/* ... Contenu de ton modal filtre ... */}
                <button onClick={() => setIsFilterOpen(false)}>Fermer</button>
             </section>
           </div>
        )}

      </IonContent>
    </IonPage>
  );
};

export default EdtPage;


