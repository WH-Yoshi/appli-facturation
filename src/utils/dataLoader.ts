import type { AppData, Partenaire, Vente } from '../types';
import { createDataStorage } from './dataStorage';

const storage = createDataStorage();


export const loadInitialData = async (): Promise<AppData> => {
  try {
    const [partenairesResponse, ventesResponse] = await Promise.all([
      fetch('/data/partenaires.json'),
      fetch('/data/ventes.json')
    ]);

    if (partenairesResponse.ok && ventesResponse.ok) {
      const [partenaires, ventes] = await Promise.all([
        partenairesResponse.json(),
        ventesResponse.json()
      ]);

      return { partenaires, ventes };
    }
  } catch (error) {
    console.warn('Error loading data from JSON files, using empty fallback:', error);
  }

  return { partenaires: [], ventes: [] };
};


export const loadDataWithFallback = async (): Promise<AppData> => {
  try {
    const [partenaires, ventes] = await Promise.all([
      storage.loadPartenaires(),
      storage.loadVentes()
    ]);

    if (partenaires.length === 0 && ventes.length === 0) {
      const initialData = await loadInitialData();
      await Promise.all([
        storage.savePartenaires(initialData.partenaires),
        storage.saveVentes(initialData.ventes)
      ]);
      return initialData;
    }

    return { partenaires, ventes };
  } catch (error) {
    console.error('Error loading data from storage, falling back to initial data:', error);
    return await loadInitialData();
  }
};


export const loadDataWithFallbackSync = (): AppData => {
  if (typeof window !== 'undefined') {
    try {
      const savedPartenaires = localStorage.getItem('appli-facturation-partenaires');
      const savedVentes = localStorage.getItem('appli-facturation-ventes');
      
      if (savedPartenaires && savedVentes) {
        return {
          partenaires: JSON.parse(savedPartenaires),
          ventes: JSON.parse(savedVentes),
        };
      }
    } catch (error) {
      console.warn('Error loading from localStorage, falling back to empty data:', error);
    }
  }
  
  return { partenaires: [], ventes: [] };
};

export const savePartenairesData = async (partenaires: Partenaire[]): Promise<void> => {
  try {
    await storage.savePartenaires(partenaires);
  } catch (error) {
    console.error('Error saving partenaires data:', error);
    throw error;
  }
};

export const saveVentesData = async (ventes: Vente[]): Promise<void> => {
  try {
    await storage.saveVentes(ventes);
  } catch (error) {
    console.error('Error saving ventes data:', error);
    throw error;
  }
};