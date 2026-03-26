# LEARN.MD - React + Ionic (JS) pour ce projet ESTIM

> Objectif: te rendre autonome pour developper chaque partie de l'app.
> Langue: FR simple (sans accents pour eviter les soucis d'encodage).

---

## 0) Cest quoi un "fallback" ?

Un fallback = un plan B.
Exemple concret:
- Tu essaies de charger des annonces depuis lAPI.
- Si lAPI ne repond pas ou renvoie une erreur,
  tu affiches des donnees locales (mock) ou une image par defaut.

Pourquoi on utilise un fallback ?
- Pour que lapp ne casse pas.
- Pour donner une experience propre meme si le backend est HS.

Dans notre code:
- imageUrl existe ? on affiche limage.
- imageUrl absent ? on affiche une image locale.

---

## 1) Vue densemble du projet

Tu as:
1. Frontend React + Ionic (dans ce dossier)
2. Backend Hono + Prisma (dans backend/estim-app-api)

Frontend:
- Vite sert de serveur dev (npm run dev)
- React gere lUI
- Ionic fournit des composants mobiles (IonPage, IonContent, etc.)
- React Router gere la navigation

Backend:
- Hono est un mini-framework pour des APIs JS
- Prisma parle a la base de donnees

---

## 2) Arborescence utile (frontend)

- src/App.jsx           -> routeur principal + tabs
- src/main.jsx          -> point dentree
- src/pages/*           -> pages ecran
- src/components/*      -> petits composants reutilisables
- src/assets/*          -> images, icons, svg
- src/theme/variables.css -> theme ionic

---

## 3) Comprendre React rapidement

### 3.1 Les composants
Un composant React est une fonction qui retourne du JSX.
Exemple:

function Hello() {
  return <div>Salut</div>;
}

Tu lutilises comme une balise:
<Hello />

### 3.2 Le JSX
Le JSX ressemble au HTML, mais cest du JS.
Tu peux injecter des variables avec { }.

const name = 'Ali';
return <p>Bonjour {name}</p>;

### 3.3 Les props
Les props sont des parametres passes au composant.

function Card({ title }) {
  return <h3>{title}</h3>;
}

<Card title="Annonce" />

### 3.4 Le state (useState)
Le state sert a memoriser des valeurs qui changent.

const [count, setCount] = useState(0);

setCount(1) met a jour.

### 3.5 Les effets (useEffect)
UseEffect sert pour:
- Appels API
- Abonnements
- Actions au montage du composant

useEffect(() => {
  // code execute au montage
}, []);

---

## 4) Comprendre Ionic React

Ionic fournit des composants pre-styles:
- IonPage
- IonContent
- IonHeader
- IonToolbar
- IonButton
- IonCard

Chaque page ionic doit etre:

<IonPage>
  <IonHeader>...</IonHeader>
  <IonContent>...</IonContent>
</IonPage>

Conseil:
- Utilise IonPage par page
- Utilise IonContent pour le contenu scrollable

---

## 5) Navigation (React Router + Ionic)

Dans App.jsx:
- IonReactRouter
- IonTabs
- IonRouterOutlet
- <Route path="/annonces"> <AdPage />

Pour naviguer via code:

const history = useHistory();
history.push('/edt');

Si tu veux un lien simple:
<IonButton routerLink="/edt">Aller</IonButton>

---

## 6) Appeler lAPI (fetch)

Exemple simple:

useEffect(() => {
  fetch('https://estim-app-api.ebanaplamedy.workers.dev//ad')
    .then((res) => res.json())
    .then((data) => setData(data.data))
    .catch((err) => console.error(err));
}, []);

Tips:
- Toujours gerer les erreurs
- Toujours prevoir un fallback

---

## 7) Architecture recommandee (frontend)

Pour rester propre:

- src/api/   -> fonctions API
- src/pages/ -> pages
- src/components/ -> UI reutilisable

Exemple API file:

// src/api/ads.js
export async function fetchAds() {
  const res = await fetch('https://estim-app-api.ebanaplamedy.workers.dev//ad');
  const data = await res.json();
  if (!data.ok) throw new Error('API error');
  return data.data;
}

Puis dans AdPage:

useEffect(() => {
  fetchAds().then(...)
}, []);

---

## 8) Debug classique

### Erreur 1: Unexpected character
Souvent cause par:
- mauvais encodage de fichier
- accents dans des cles dobjet non quotees
Fix:
- mettre les cles entre quotes
- eviter les accents dans noms de cles

### Erreur 2: import non resolu
Ex:
Failed to resolve import "react-icons/md"
Cause: package non installe
Fix:
- npm install react-icons
- ou retirer limport

### Erreur 3: CORS
Backend refuse ton front
Fix backend:
- ajouter origin localhost:5173

### Erreur 4: API renvoie 500
Souvent:
- schema zod invalide
- DB pas connectee

---

## 9) Methode de travail autonome

1. Tu ecris la fonctionnalite en pseudo-code
2. Tu decoupes en petites taches
3. Tu testes une par une
4. Tu commits si tout marche

Exemple:
- Ajouter page Edt
- Creer route /edt
- Ajouter bouton vers /edt
- Afficher liste

---

## 10) Creation dune nouvelle page

1. Cree un fichier dans src/pages/NomPage.jsx
2. Ajoute un <Route> dans App.jsx
3. Si besoin, ajoute un bouton/lien

---

## 11) Ajouter un composant reutilisable

1. Cree src/components/MyCard.jsx
2. Export default MyCard
3. Import dans la page

---

## 12) Lier les donnees a lUI

Exemple pour annonces:

const [ads, setAds] = useState([]);

useEffect(() => {
  fetchAds().then(setAds);
}, []);

return ads.map((a) => <Card key={a.id} {...a} />);

---

## 13) Comment penser les data

Toujours se poser:
- Quelle structure ?
- Quels champs obligatoires ?
- Quels champs optionnels ?

Exemple annonce:
{
  uuid: string,
  titre: string,
  description: string,
  imageUrl: string | null,
  publishAt: string
}

---

## 14) Erreurs frequentes + solutions

- "Cannot read properties of undefined":
  -> Verifier que la variable existe avant usage

- "map is not a function":
  -> Verifier que tu as bien un tableau

- "NetworkError when attempting to fetch resource":
  -> API pas lancee ou mauvais port

- "CORS policy":
  -> Autoriser lorigine dans le backend

---

## 15) React mental model

React = UI = fonction de lEtat
UI = f(state)

Si le state change, UI se met a jour.

---

## 16) Plan pour devenir autonome

1. Maitriser React (components + state)
2. Maitriser fetch + async/await
3. Maitriser la navigation
4. Maitriser la gestion des erreurs
5. Maitriser la structure des fichiers

---

## 17) Checklist avant de coder

- Quel ecran ?
- Quelle route ?
- Quelles donnees ?
- API existe ?
- UI maquette ?
- Erreurs possibles ?

---

## 18) Tests manuels rapides

- Ouvrir lapp
- Verifier les routes
- Tester les boutons
- Simuler API offline
- Verifier que fallback marche

---

## 19) React Hooks utiles

- useState
- useEffect
- useMemo (optimisation)
- useCallback (memoiser fonctions)

---

## 20) Exemple complet (AdPage)

Pseudo:
1. state: announcements, loading, error
2. useEffect fetch
3. map donnees -> cards
4. fallback image

---

## 21) Exemple complet (EdtPage)

Pseudo:
1. state: schedule
2. fetch /edt
3. map event -> timeline

---

## 22) Liste des points de friction frequents

- Encodage (accents dans JS)
- Import manquant
- Appel API sur mauvais port
- mauvais format JSON
- oubli de return dans map

---

## 23) Hono backend basics

- app.get('/ad', ...) -> lire
- app.post('/ad/add', ...) -> ajouter
- app.put('/ad/update/:id', ...) -> modifier
- app.delete('/ad/delete/:id', ...) -> supprimer

---

## 24) Zod validation

Zod valide les donnees du body.
Si tu envoies un mauvais format, tu auras 400/500.

---

## 25) Comment travailler sans moi

Quand tu es bloque:
1. Lis le message d erreur entier
2. Repere fichier + ligne
3. Isole la partie qui cause le bug
4. Corrige petit a petit
5. Re-teste

---

## 26) Roadmap perso

1. Stabiliser annonces
2. Brancher emploi du temps
3. Ajouter formulaire ajout annonce
4. Ajouter auth
5. Ameliorer UI

---

## 27) Aide rapide (memo)

- Demarrer front: npm run dev
- Demarrer backend: npm run dev (dans backend)
- Tester API: https://estim-app-api.ebanaplamedy.workers.dev//health

---

## 28) FAQ anticipee

Q: Pourquoi useEffect ne se declenche pas ?
R: Tu as mis un tableau [] vide ? Ou tu as oublie de limporter.

Q: Pourquoi mes images ne saffichent pas ?
R: URL invalide, CORS image, ou chemin local faux.

Q: Pourquoi mon composant ne se met pas a jour ?
R: Tu modifies une variable sans passer par setState.

Q: Pourquoi jai une page blanche ?
R: Une erreur JS stoppe le rendu. Regarde la console.

Q: Comment debugger ?
R: console.log, devtools, isoler le bug.

---

## 29) Comment structurer les datas reelles

Toujours convertir la reponse API:

const mapped = apiData.map((x) => ({
  id: x.uuid,
  title: x.titre,
  body: x.description || '',
  date: new Date(x.publishAt).toLocaleDateString('fr-FR')
}));

---

## 30) Conseils de pro

- Commence simple
- Commit souvent
- Pas de feature geante sans tests
- UI avant data complexe
- Toujours un fallback

---

## 31) Glossaire court (voir glossary.md)

Payload, migration, schema, CORS, etc.

---

## 32) A toi maintenant

Ta prochaine tache:
- Choisis une page
- Ajoute une nouvelle fonction
- Teste
- Observe les erreurs
- Corrige

Tu peux y arriver sans aide. Tu as tout dans ce guide.

---

## 33) Ce que jai ajoute pour lAPI (Edt + Ad)

But: integrer lAPI locale dans EdtPage et AdPage avec useState et filtres.

Fichiers touches:
- src/api/estimApi.js
- src/pages/EdtPage.jsx
- src/pages/AdPage.jsx

Details:
- estimApi.js:
  - Classe EstimApi qui fait les appels fetch.
  - getAd() appelle GET /ad, getEdt() appelle GET /edt.
  - normalizeList() accepte tableau direct ou { data } ou { items }.
  - Retourne toujours un tableau (sinon [] en cas derreur).

- AdPage.jsx:
  - useState pour announcements, loading, error, search, activeCategory.
  - useEffect -> api.getAd() -> map vers la carte UI.
  - Filtre annonces par categorie + texte de recherche.
  - Fallback sur mockAnnouncements si lAPI echoue.

- EdtPage.jsx:
  - useState pour courses, loading, error, activeDay.
  - Ajout d un modal de filtres (niveau, filiere, type) avec chips et select.
  - useEffect -> api.getEdt() -> map vers la timeline UI.
  - Filtre les cours par jour selectionne + filtres + tri par heure.
  - Affiche un message si pas de cours.

Si lAPI renvoie un autre format, adapte mapApiAdToAnnouncement ou mapApiEdtToCourse.

---

Fin.
