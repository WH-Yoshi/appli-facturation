import type { Partenaire, Vente } from '../types';

/**
 * Data storage interface that can be implemented for different environments
 * (Web with localStorage, Electron with file system, Tauri with file system)
 */
export interface DataStorage {
  loadPartenaires(): Promise<Partenaire[]>;
  savePartenaires(partenaires: Partenaire[]): Promise<void>;
  loadVentes(): Promise<Vente[]>;
  saveVentes(ventes: Vente[]): Promise<void>;
}

/**
 * LocalStorage implementation for web/development
 */
export class LocalStorageDataStorage implements DataStorage {
  private readonly PARTENAIRES_KEY = 'appli-facturation-partenaires';
  private readonly VENTES_KEY = 'appli-facturation-ventes';

  async loadPartenaires(): Promise<Partenaire[]> {
    try {
      const data = localStorage.getItem(this.PARTENAIRES_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error loading partenaires from localStorage:', error);
      return [];
    }
  }

  async savePartenaires(partenaires: Partenaire[]): Promise<void> {
    try {
      localStorage.setItem(this.PARTENAIRES_KEY, JSON.stringify(partenaires));
    } catch (error) {
      console.error('Error saving partenaires to localStorage:', error);
      throw error;
    }
  }

  async loadVentes(): Promise<Vente[]> {
    try {
      const data = localStorage.getItem(this.VENTES_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error loading ventes from localStorage:', error);
      return [];
    }
  }

  async saveVentes(ventes: Vente[]): Promise<void> {
    try {
      localStorage.setItem(this.VENTES_KEY, JSON.stringify(ventes));
    } catch (error) {
      console.error('Error saving ventes to localStorage:', error);
      throw error;
    }
  }
}

/**
 * Electron file system implementation (placeholder for future use)
 */
export class ElectronDataStorage implements DataStorage {
  async loadPartenaires(): Promise<Partenaire[]> {
    try {
      // In Electron, you would use:
      // const data = await window.electronAPI.loadFile('partenaires.json');
      // return JSON.parse(data);
      
      // For now, fallback to localStorage
      const storage = new LocalStorageDataStorage();
      return storage.loadPartenaires();
    } catch (error) {
      console.error('Error loading partenaires from Electron:', error);
      return [];
    }
  }

  async savePartenaires(partenaires: Partenaire[]): Promise<void> {
    try {
      // In Electron, you would use:
      // await window.electronAPI.saveFile('partenaires.json', JSON.stringify(partenaires, null, 2));
      
      // For now, fallback to localStorage
      const storage = new LocalStorageDataStorage();
      return storage.savePartenaires(partenaires);
    } catch (error) {
      console.error('Error saving partenaires to Electron:', error);
      throw error;
    }
  }

  async loadVentes(): Promise<Vente[]> {
    try {
      // In Electron, you would use:
      // const data = await window.electronAPI.loadFile('ventes.json');
      // return JSON.parse(data);
      
      // For now, fallback to localStorage
      const storage = new LocalStorageDataStorage();
      return storage.loadVentes();
    } catch (error) {
      console.error('Error loading ventes from Electron:', error);
      return [];
    }
  }

  async saveVentes(ventes: Vente[]): Promise<void> {
    try {
      // In Electron, you would use:
      // await window.electronAPI.saveFile('ventes.json', JSON.stringify(ventes, null, 2));
      
      // For now, fallback to localStorage
      const storage = new LocalStorageDataStorage();
      return storage.saveVentes(ventes);
    } catch (error) {
      console.error('Error saving ventes to Electron:', error);
      throw error;
    }
  }
}

/**
 * Tauri file system implementation (placeholder for future use)
 */
export class TauriDataStorage implements DataStorage {
  async loadPartenaires(): Promise<Partenaire[]> {
    try {
      // In Tauri, you would use:
      // const { invoke } = await import('@tauri-apps/api/core');
      // const data = await invoke('load_file', { filename: 'partenaires.json' });
      // return JSON.parse(data);
      
      // For now, fallback to localStorage
      const storage = new LocalStorageDataStorage();
      return storage.loadPartenaires();
    } catch (error) {
      console.error('Error loading partenaires from Tauri:', error);
      return [];
    }
  }

  async savePartenaires(partenaires: Partenaire[]): Promise<void> {
    try {
      // In Tauri, you would use:
      // const { invoke } = await import('@tauri-apps/api/core');
      // await invoke('save_file', { filename: 'partenaires.json', content: JSON.stringify(partenaires, null, 2) });
      
      // For now, fallback to localStorage
      const storage = new LocalStorageDataStorage();
      return storage.savePartenaires(partenaires);
    } catch (error) {
      console.error('Error saving partenaires to Tauri:', error);
      throw error;
    }
  }

  async loadVentes(): Promise<Vente[]> {
    try {
      // In Tauri, you would use:
      // const { invoke } = await import('@tauri-apps/api/core');
      // const data = await invoke('load_file', { filename: 'ventes.json' });
      // return JSON.parse(data);
      
      // For now, fallback to localStorage
      const storage = new LocalStorageDataStorage();
      return storage.loadVentes();
    } catch (error) {
      console.error('Error loading ventes from Tauri:', error);
      return [];
    }
  }

  async saveVentes(ventes: Vente[]): Promise<void> {
    try {
      // In Tauri, you would use:
      // const { invoke } = await import('@tauri-apps/api/core');
      // await invoke('save_file', { filename: 'ventes.json', content: JSON.stringify(ventes, null, 2) });
      
      // For now, fallback to localStorage
      const storage = new LocalStorageDataStorage();
      return storage.saveVentes(ventes);
    } catch (error) {
      console.error('Error saving ventes to Tauri:', error);
      throw error;
    }
  }
}

/**
 * Factory function to create the appropriate storage implementation
 */
export function createDataStorage(): DataStorage {
  // Detect environment and return appropriate storage
  // In the future, you can add detection for Electron/Tauri
  
  // Check if we're in Electron
  if (typeof window !== 'undefined' && (window as unknown as { electronAPI?: unknown }).electronAPI) {
    return new ElectronDataStorage();
  }
  
  // Check if we're in Tauri
  if (typeof window !== 'undefined' && (window as unknown as { __TAURI__?: unknown }).__TAURI__) {
    return new TauriDataStorage();
  }
  
  // Default to localStorage for web
  return new LocalStorageDataStorage();
}