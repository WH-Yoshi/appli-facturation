import type { AppData, Partenaire, Vente, CommissionHistorique } from '../types';

const validateArrayData = <T>(data: unknown, dataType: string): T[] => {
  if (!Array.isArray(data)) {
    console.warn(`Invalid ${dataType} data format, using empty array`);
    return [];
  }
  return data as T[];
};

const ensureDataFileExists = async <T>(filename: string, defaultData: T): Promise<T> => {
  try {
    const response = await fetch(`/data/${filename}`);
    
    if (response.ok) {
      return await response.json() as T;
    } else if (response.status === 404) {
      console.log(`Creating ${filename} with default data`);
      await createDataFile(filename, defaultData);
      return defaultData;
    } else {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    if (error instanceof TypeError && error.message.includes('fetch')) {
      console.log(`File ${filename} not found, creating with default data`);
      await createDataFile(filename, defaultData);
      return defaultData;
    }
    throw error;
  }
};

const createDataFile = async <T>(filename: string, data: T): Promise<void> => {
  console.log(`Creating ${filename} (web mode - logged only):`, data);
  // TODO: In Electron/Tauri, replace with actual file writing:
  // - Electron: await window.electronAPI.writeDataFile(filename, data)
  // - Tauri: await invoke('write_data_file', { filename, data })
};

export const loadData = async (): Promise<AppData> => {
  try {
    const [partenairesData, ventesData, commissionsData] = await Promise.all([
      ensureDataFileExists('partenaires.json', []),
      ensureDataFileExists('ventes.json', []),
      ensureDataFileExists('commissions.json', [])
    ]);

    const partenaires = validateArrayData<Partenaire>(partenairesData, 'partenaires');
    const ventes = validateArrayData<Vente>(ventesData, 'ventes');
    const commissionsPayees = validateArrayData<CommissionHistorique>(commissionsData, 'commissions');

    return { partenaires, ventes, commissionsPayees };
  } catch (error) {
    console.error('Error loading data:', error);
    return getEmptyData();
  }
};

export const getEmptyData = (): AppData => {
  return { partenaires: [], ventes: [], commissionsPayees: [] };
};

export const savePartenairesData = async (partenaires: Partenaire[]): Promise<void> => {
  try {
    console.log('Saving partenaires (web mode - logged only):', partenaires);
    // TODO: In Electron/Tauri, replace with actual file writing:
    // - Electron: await window.electronAPI.writeDataFile('partenaires.json', partenaires)
    // - Tauri: await invoke('write_data_file', { filename: 'partenaires.json', data: partenaires })
  } catch (error) {
    console.error('Error saving partenaires data:', error);
    throw new Error('Failed to save partenaires data');
  }
};

export const saveVentesData = async (ventes: Vente[]): Promise<void> => {
  try {
    console.log('Saving ventes (web mode - logged only):', ventes);
    // TODO: In Electron/Tauri, replace with actual file writing:
    // - Electron: await window.electronAPI.writeDataFile('ventes.json', ventes)
    // - Tauri: await invoke('write_data_file', { filename: 'ventes.json', data: ventes })
  } catch (error) {
    console.error('Error saving ventes data:', error);
    throw new Error('Failed to save ventes data');
  }
};

export const saveCommissionsData = async (commissions: CommissionHistorique[]): Promise<void> => {
  try {
    console.log('Saving commissions (web mode - logged only):', commissions);
    // TODO: In Electron/Tauri, replace with actual file writing:
    // - Electron: await window.electronAPI.writeDataFile('commissions.json', commissions)
    // - Tauri: await invoke('write_data_file', { filename: 'commissions.json', data: commissions })
  } catch (error) {
    console.error('Error saving commissions data:', error);
    throw new Error('Failed to save commissions data');
  }
};