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

describe('EdtPage', () => {
  beforeEach(() => {
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(new Date('2026-04-17T08:00:00Z'));

    requestMock.mockImplementation(async (path) => {
      const responses = {
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
              classeId: 'classe-gi',
            },
            {
              uuid: 'gi-early',
              jourSemaine: 'LUNDI',
              heureDebut: '09',
              heureFin: '10',
              matiereId: 'matiere-python',
              salleId: 'salle-nelson',
              professeurId: 'prof-mambou',
              classeId: 'classe-gi',
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
              uuid: 'classe-gi',
              nom: 'GI',
              filiere: { sigle: 'GI' },
              niveau: { code: 'L1' },
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

      return responses[path] || { data: [] };
    });
  });

  afterEach(() => {
    requestMock.mockReset();
    vi.useRealTimers();
  });

  test('renders weekly courses by filiere, ignores invalid rows, and resyncs the open day', async () => {
    const user = userEvent.setup();
    renderPage();

    expect(await screen.findByRole('heading', { name: /emploi du temps/i })).toBeInTheDocument();
    expect(await screen.findByText(/09h00 - 10h00/i)).toBeInTheDocument();
    expect(screen.getByText(/15h00 - 16h00/i)).toBeInTheDocument();
    expect(screen.queryByText('Fantome')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'L1' })).toBeInTheDocument();

    await user.selectOptions(screen.getByRole('combobox', { name: /choisir une fili.re/i }), 'GEA');

    expect(await screen.findByText(/11h00 - 12h00/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByText(/09h00 - 10h00/i)).not.toBeInTheDocument();
    });

    expect(screen.queryByRole('button', { name: 'L1' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Tous' })).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'MARDI' })).toHaveAttribute('aria-expanded', 'true');
  });
});
