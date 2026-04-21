import {
  getDefaultOpenDay,
  normalizeWeeklyCourse,
  normalizeWeeklyCourses,
} from './weeklyEdt';

describe('weeklyEdt helpers', () => {
  test('normalizes a weekly course payload into a stable UI object', () => {
    const course = normalizeWeeklyCourse({
      uuid: 'course-1',
      jourSemaine: 'lundi',
      heureDebut: '09',
      heureFin: '10',
      type: 'COURS',
      matiere: { nom: 'Python' },
      salle: { nom: 'Nelson Mandela' },
      professeur: { nom: 'M.MAMBOU Marcel Mesmin' },
      classe: { nom: 'GI' },
    });

    expect(course).toMatchObject({
      id: 'course-1',
      dayKey: 'LUNDI',
      dayLabel: 'LUNDI',
      timeRange: '09h00 - 10h00',
      subject: 'Python',
      room: 'Nelson Mandela',
      teacher: 'M.MAMBOU Marcel Mesmin',
      filiere: 'GI',
      level: null,
      type: 'COURS',
    });
  });

  test('filters invalid rows and keeps courses sorted by start hour', () => {
    const courses = normalizeWeeklyCourses([
      {
        uuid: 'invalid',
        jourSemaine: null,
        heureDebut: null,
        heureFin: null,
        matiere: { nom: 'Ignore me' },
        classe: { nom: 'GI' },
      },
      {
        uuid: 'later',
        jourSemaine: 'LUNDI',
        heureDebut: '15',
        heureFin: '16',
        matiere: { nom: 'Python avance' },
        classe: { nom: 'GI' },
      },
      {
        uuid: 'early',
        jourSemaine: 'LUNDI',
        heureDebut: '09',
        heureFin: '10',
        matiere: { nom: 'Python' },
        classe: { nom: 'GI' },
      },
    ]);

    expect(courses).toHaveLength(2);
    expect(courses.map((course) => course.id)).toEqual(['early', 'later']);
  });

  test('picks the preferred day when it has courses, otherwise the first available day', () => {
    const groupedDays = [
      { key: 'LUNDI', courses: [{ id: '1' }] },
      { key: 'MARDI', courses: [] },
      { key: 'MERCREDI', courses: [{ id: '2' }] },
    ];

    expect(getDefaultOpenDay(groupedDays, 'MERCREDI')).toBe('MERCREDI');
    expect(getDefaultOpenDay(groupedDays, 'VENDREDI')).toBe('LUNDI');
  });
});
