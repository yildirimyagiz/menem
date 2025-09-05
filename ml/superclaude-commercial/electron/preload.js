const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  // Window controls
  minimizeWindow: () => ipcRenderer.send('minimize-window'),
  maximizeWindow: () => ipcRenderer.send('maximize-window'),
  closeWindow: () => ipcRenderer.send('close-window'),
  
  // File operations
  selectDirectory: () => ipcRenderer.invoke('select-directory'),
  selectFile: (options) => ipcRenderer.invoke('select-file', options),
  
  // AI processing
  processAIRequest: (request) => ipcRenderer.invoke('process-ai-request', request),
  
  // Subscription management
  checkSubscription: () => ipcRenderer.invoke('check-subscription'),
  
  // Project management
  saveProject: (projectData) => ipcRenderer.invoke('save-project', projectData),
  loadProject: (projectId) => ipcRenderer.invoke('load-project', projectId),
  
  // App events
  onNewProject: (callback) => ipcRenderer.on('new-project', callback),
  onOpenProject: (callback) => ipcRenderer.on('open-project', callback),
  onOpenPreferences: (callback) => ipcRenderer.on('open-preferences', callback),
  onOpenDocs: (callback) => ipcRenderer.on('open-docs', callback),
  onReportIssue: (callback) => ipcRenderer.on('report-issue', callback),
  
  // Remove listeners
  removeAllListeners: (channel) => ipcRenderer.removeAllListeners(channel)
}); 