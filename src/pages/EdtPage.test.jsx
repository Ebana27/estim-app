import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { IonApp } from '@ionic/react';

const requestMock = vi.fn();

vi.mock('../js/api/estimApi', () => {
  return {
    default: class MockEstimApi {
      request(path) {
        return requestMock(path);
      }

      normalizeList(payload) {
        if (Array.isArray(payload)) return payload;
        if (Array.isArray(payload?.data)) return payload.data;
        if (Array.isArray(payload?.items)) return payload.items;
        return [];
      }
    },
  };
});

import EdtPage from './EdtPage';

const renderPage = () => {
  return render(
    <IonApp>
      <EdtPage />
    </IonApp>,
  );
};

const setMockResponses = (responses) => {
  requestMock.mockImplementation(async (path) => responses[path] || { data: [] });
};

const createDefaultResponses = () => {
  return {
    '/edt': {
      data: [
        {
          uuid: 'invalid-row',
          jourSemaine: null,
          heureDebut: null,
          heureFin: null,
          matiere: { nom: 'Fantome' },
          classe: { nom: 'GI' },
        },
        {
          uuid: 'gi-late',
          jourSemaine: 'LUNDI',
          heureDebut: '15',
          heureFin: '16',
          matiereId: 'matiere-python-advanced',
          salleId: 'salle-nelson',
          professeurId: 'prof-mambou',
          classeId: 'classe-gi-l1',
        },
        {
          uuid: 'gi-early',
          jourSemaine: 'LUNDI',
          heureDebut: '09',
          heureFin: '10',
          matiereId: 'matiere-python',
          salleId: 'salle-nelson',
          professeurId: 'prof-mambou',
          classeId: 'classe-gi-l1',
        },
        {
          uuid: 'gi-l2-wednesday',
          jourSemaine: 'MERCREDI',
          heureDebut: '13',
          heureFin: '14',
          matiereId: 'matiere-reseau',
          salleId: 'salle-b205',
          professeurId: 'prof-rose',
          classeId: 'classe-gi-l2',
        },
        {
          uuid: 'gea-tuesday',
          jourSemaine: 'MARDI',
          heureDebut: '11',
          heureFin: '12',
          matiereId: 'matiere-anglais',
          salleId: 'salle-b205',
          professeurId: 'prof-rose',
          classeId: 'classe-gea',
        },
      ],
    },
    '/classes': {
      data: [
        {
          uuid: 'classe-gi-l1',
          nom: 'GI L1',
          filiere: { sigle: 'GI' },
          niveau: { code: 'L1' },
        },
        {
          uuid: 'classe-gi-l2',
          nom: 'GI L2',
          filiere: { sigle: 'GI' },
          niveau: { code: 'L2' },
        },
        {
          uuid: 'classe-gea',
          nom: 'GEA',
          filiere: { sigle: 'GEA' },
          niveau: null,
        },
      ],
    },
    '/matieres': {
      data: [
        { uuid: 'matiere-python', nom: 'Python' },
        { uuid: 'matiere-python-advanced', nom: 'Python avance' },
        { uuid: 'matiere-anglais', nom: 'Anglais' },
        { uuid: 'matiere-reseau', nom: 'Reseaux' },
      ],
    },
    '/salles': {
      data: [
        { uuid: 'salle-nelson', nom: 'Nelson Mandela' },
        { uuid: 'salle-b205', nom: 'Salle B205' },
      ],
    },
    '/professeurs': {
      data: [
        { uuid: 'prof-mambou', nom: 'M.MAMBOU Marcel Mesmin' },
        { uuid: 'prof-rose', nom: 'Mme Rose' },
      ],
    },
  };
};

describe('EdtPage', () => {
  beforeEach(() => {
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(new Date('2026-04-17T08:00:00Z'));
    setMockResponses(createDefaultResponses());
  });

  afterEach(() => {
    requestMock.mockReset();
    vi.useRealTimers();
  });

  test('renders weekly courses, exposes the niveau dropdown, filters levels, and resyncs the open day', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    renderPage();

    const filiereSelect = await screen.findByRole('combobox', { name: /choisir une fili.re/i });
    const levelSelect = screen.getByRole('combobox', { name: /choisir un niveau/i });

    expect(await screen.findByText(/09h00 - 10h00/i)).toBeInTheDocument();
    expect(screen.getByText(/15h00 - 16h00/i)).toBeInTheDocument();
    expect(screen.queryByText('Fantome')).not.toBeInTheDocument();
    expect(filiereSelect).toHaveValue('GI');
    expect(levelSelect).toHaveValue('Tous');
    expect(screen.getByRole('option', { name: 'L1' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'L2' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'LUNDI' })).toHaveAttribute('aria-expanded', 'true');

    await user.selectOptions(levelSelect, 'L2');

    expect(await screen.findByText(/13h00 - 14h00/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByText(/09h00 - 10h00/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/15h00 - 16h00/i)).not.toBeInTheDocument();
    });

    expect(levelSelect).toHaveValue('L2');
    expect(screen.getByRole('button', { name: 'MERCREDI' })).toHaveAttribute('aria-expanded', 'true');
  });

  test('falls back to GI all levels when the chosen filiere has no level', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    renderPage();

    const filiereSelect = await screen.findByRole('combobox', { name: /choisir une fili.re/i });
    const levelSelect = screen.getByRole('combobox', { name: /choisir un niveau/i });

    await user.selectOptions(filiereSelect, 'GEA');

    await waitFor(() => {
      expect(filiereSelect).toHaveValue('GI');
      expect(levelSelect).toHaveValue('Tous');
    });

    expect(screen.getByText(/09h00 - 10h00/i)).toBeInTheDocument();
    expect(screen.getByText(/15h00 - 16h00/i)).toBeInTheDocument();
    expect(screen.queryByText(/11h00 - 12h00/i)).not.toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'L2' })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'MERCREDI' }));

    expect(await screen.findByText(/13h00 - 14h00/i)).toBeInTheDocument();
  });

  test('keeps an empty state when no level exists and GI is unavailable', async () => {
    setMockResponses({
      '/edt': {
        data: [
          {
            uuid: 'gea-tuesday',
            jourSemaine: 'MARDI',
            heureDebut: '11',
            heureFin: '12',
            matiereId: 'matiere-anglais',
            salleId: 'salle-b205',
            professeurId: 'prof-rose',
            classeId: 'classe-gea',
          },
        ],
      },
      '/classes': {
        data: [
          {
            uuid: 'classe-gea',
            nom: 'GEA',
            filiere: { sigle: 'GEA' },
            niveau: null,
          },
        ],
      },
      '/matieres': {
        data: [{ uuid: 'matiere-anglais', nom: 'Anglais' }],
      },
      '/salles': {
        data: [{ uuid: 'salle-b205', nom: 'Salle B205' }],
      },
      '/professeurs': {
        data: [{ uuid: 'prof-rose', nom: 'Mme Rose' }],
      },
    });

    renderPage();

    const filiereSelect = await screen.findByRole('combobox', { name: /choisir une fili.re/i });
    const levelSelect = screen.getByRole('combobox', { name: /choisir un niveau/i });

    await waitFor(() => {
      expect(filiereSelect).toHaveValue('GEA');
      expect(levelSelect).toBeDisabled();
    });

    expect(await screen.findByText(/aucun cours pour cette fili.re/i)).toBeInTheDocument();
    expect(screen.queryByText(/11h00 - 12h00/i)).not.toBeInTheDocument();
  });
});
