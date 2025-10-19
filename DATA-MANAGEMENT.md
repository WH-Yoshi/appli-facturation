# Data Management System

This application now uses a flexible data management system that's ready for Electron or Tauri deployment.

## Current Implementation

### Data Storage
- **Development/Web**: Uses localStorage for persistence
- **Production**: Ready for file system storage (Electron/Tauri)

### Data Files
- `public/data/partenaires.json` - Partner data
- `public/data/ventes.json` - Sales data

### Architecture

#### DataStorage Interface
The `DataStorage` interface in `src/utils/dataStorage.ts` provides a consistent API for data operations across different environments:

```typescript
interface DataStorage {
  loadPartenaires(): Promise<Partenaire[]>;
  savePartenaires(partenaires: Partenaire[]): Promise<void>;
  loadVentes(): Promise<Vente[]>;
  saveVentes(ventes: Vente[]): Promise<void>;
}
```

#### Implementations
1. **LocalStorageDataStorage** - Current implementation for web
2. **ElectronDataStorage** - Ready for Electron (placeholder)
3. **TauriDataStorage** - Ready for Tauri (placeholder)

### Data Loading Strategy
1. Try to load from storage (localStorage, files, etc.)
2. If no data exists, load initial data from JSON files
3. Save initial data to storage for future use
4. Fallback to hardcoded data if all else fails

## Migration to Electron

To use with Electron:

1. **Main Process**: Add IPC handlers for file operations
```javascript
ipcMain.handle('save-file', async (event, filename, content) => {
  // Save file to app data directory
});

ipcMain.handle('load-file', async (event, filename) => {
  // Load file from app data directory
});
```

2. **Preload Script**: Expose safe file operations
```javascript
contextBridge.exposeInMainWorld('electronAPI', {
  saveFile: (filename, content) => ipcRenderer.invoke('save-file', filename, content),
  loadFile: (filename) => ipcRenderer.invoke('load-file', filename)
});
```

3. **Update Detection**: Modify `createDataStorage()` to detect Electron environment

## Migration to Tauri

To use with Tauri:

1. **Rust Backend**: Add Tauri commands for file operations
```rust
#[tauri::command]
async fn save_file(filename: String, content: String) -> Result<(), String> {
  // Save file to app data directory
}

#[tauri::command]
async fn load_file(filename: String) -> Result<String, String> {
  // Load file from app data directory
}
```

2. **Frontend**: Use Tauri invoke API (already prepared in TauriDataStorage)

3. **Update Detection**: Modify `createDataStorage()` to detect Tauri environment

## Development

### Adding New Data Types
1. Define TypeScript interface in `src/types/index.ts`
2. Add methods to `DataStorage` interface
3. Implement in all storage classes
4. Add to initial data JSON files
5. Update `useCommissionData` hook if needed

### Testing
- Data is automatically saved to localStorage during development
- Check browser DevTools > Application > Local Storage to see stored data
- Clear localStorage to reset to initial data

## File Structure

```
public/
  data/
    partenaires.json    # Initial partner data
    ventes.json         # Initial sales data

src/
  utils/
    dataStorage.ts      # Storage interface and implementations
    dataLoader.ts       # Data loading utilities
  hooks/
    useCommissionData.ts # Main data management hook
```

## Benefits

1. **Environment Agnostic**: Same code works in web, Electron, and Tauri
2. **Offline Ready**: Data persists locally
3. **Graceful Fallbacks**: Multiple fallback strategies
4. **Type Safe**: Full TypeScript support
5. **Scalable**: Easy to add new data types and storage methods