import type { AppData, Partenaire, Vente } from '../types';

/**
 * Load data directly from JSON files
 * Always fetches fresh data - perfect for development and ready for Electron/Tauri
 */
export const loadData = async (): Promise<AppData> => {
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
    console.warn('Error loading data from JSON files:', error);
  }

  // Fallback to empty data if files can't be loaded
  return { partenaires: [], ventes: [] };
};

/**
 * Synchronous fallback that returns empty data
 * Used for React useState initialization
 */
export const getEmptyData = (): AppData => {
  return { partenaires: [], ventes: [] };
};

/**
 * Save partenaires data
 * In web mode: logs only (can't write to files)
 * In Electron/Tauri: will write to actual files
 */
export const savePartenairesData = async (partenaires: Partenaire[]): Promise<void> => {
  console.log('Saving partenaires (web mode - logged only):', partenaires);
  // TODO: In Electron/Tauri, replace with actual file writing:
  // - Electron: await window.electronAPI.writeDataFile('partenaires.json', partenaires)
  // - Tauri: await invoke('write_data_file', { filename: 'partenaires.json', data: partenaires })
};

/**
 * Save ventes data
 * In web mode: logs only (can't write to files) 
 * In Electron/Tauri: will write to actual files
 */
export const saveVentesData = async (ventes: Vente[]): Promise<void> => {
  console.log('Saving ventes (web mode - logged only):', ventes);
  // TODO: In Electron/Tauri, replace with actual file writing:
  // - Electron: await window.electronAPI.writeDataFile('ventes.json', ventes)
  // - Tauri: await invoke('write_data_file', { filename: 'ventes.json', data: ventes })
};