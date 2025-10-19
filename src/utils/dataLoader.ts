import type { AppData, Partenaire, Vente, CommissionHistorique } from '../types';

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

      return { partenaires, ventes, commissionsPayees: [] };
    }
  } catch (error) {
    console.warn('Error loading data from JSON files:', error);
  }

  return { partenaires: [], ventes: [], commissionsPayees: [] };
};

export const getEmptyData = (): AppData => {
  return { partenaires: [], ventes: [], commissionsPayees: [] };
};

export const savePartenairesData = async (partenaires: Partenaire[]): Promise<void> => {
  console.log('Saving partenaires (web mode - logged only):', partenaires);
  // TODO: In Electron/Tauri, replace with actual file writing:
  // - Electron: await window.electronAPI.writeDataFile('partenaires.json', partenaires)
  // - Tauri: await invoke('write_data_file', { filename: 'partenaires.json', data: partenaires })
};

export const saveVentesData = async (ventes: Vente[]): Promise<void> => {
  console.log('Saving ventes (web mode - logged only):', ventes);
  // TODO: In Electron/Tauri, replace with actual file writing:
  // - Electron: await window.electronAPI.writeDataFile('ventes.json', ventes)
  // - Tauri: await invoke('write_data_file', { filename: 'ventes.json', data: ventes })
};

export const saveCommissionsData = async (commissions: CommissionHistorique[]): Promise<void> => {
  console.log('Saving commissions (web mode - logged only):', commissions);
  // TODO: In Electron/Tauri, replace with actual file writing:
  // - Electron: await window.electronAPI.writeDataFile('commissions.json', commissions)
  // - Tauri: await invoke('write_data_file', { filename: 'commissions.json', data: commissions })
};