/* src\api\estimApi.js */
class EstimApi {
  constructor(path) {
    this.baseUrl = 'https://estim-app-api.ebanaplamedy.workers.dev';
    this.path = path;
  }

  async request(path) {
    const normalizedPath = path?.toString().replace(/^\/+/g, '');
    const url = `${this.baseUrl}/${normalizedPath}`;
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`API error ${res.status}`);
    }
    return res.json();
  }

  normalizeList(payload) {
    if (Array.isArray(payload)) return payload;
    if (Array.isArray(payload?.data)) return payload.data;
    if (Array.isArray(payload?.items)) return payload.items;
    return [];
  }

  // Methode pour appeler les annonces
  async getAd(path = '/ad') {
    try {
      const data = await this.request(path);
      return this.normalizeList(data);
    } catch (error) {
      console.error("Ad&Probleme lors de l'appel API ", error);
      return [];
    }
  }

  // Methodes pour appeler les emplois du temps
  async getEdt(path = '/edt') {
    try {
      const data = await this.request(path);
      return this.normalizeList(data);
    } catch (error) {
      console.error("Edt&Probleme lors de l'appel API ", error);
      return [];
    }
  }

  async getCampus(path = '/campus') {
    try {
      const data = await this.request(path);
      return this.normalizeList(data);
    } catch (error) {
      console.error("Campus&Probleme lors de l'appel API ", error);
      return [];
    }
  }

  async getSemestres(path = '/semestres') {
    try {
      const data = await this.request(path);
      return this.normalizeList(data);
    } catch (error) {
      console.error("Semestres&Probleme lors de l'appel API ", error);
      return [];
    }
  }

  async getClasses(path = '/classes') {
    try {
      const data = await this.request(path);
      return this.normalizeList(data);
    } catch (error) {
      console.error("Classes&Probleme lors de l'appel API ", error);
      return [];
    }
  }

  async getSalles(path = '/salles') {
    try {
      const data = await this.request(path);
      return this.normalizeList(data);
    } catch (error) {
      console.error("Salles&Probleme lors de l'appel API ", error);
      return [];
    }
  }

  async getMatieres(path = '/matieres') {
    try {
      const data = await this.request(path);
      return this.normalizeList(data);
    } catch (error) {
      console.error("Matieres&Probleme lors de l'appel API ", error);
      return [];
    }
  }

  async getProfesseurs(path = '/professeurs') {
    try {
      const data = await this.request(path);
      return this.normalizeList(data);
    } catch (error) {
      console.error("Professeurs&Probleme lors de l'appel API ", error);
      return [];
    }
  }
}

export default EstimApi;
