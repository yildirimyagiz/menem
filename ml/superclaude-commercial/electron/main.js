console.log('ELECTRON NODE_ENV:', process.env.NODE_ENV);
const { app, BrowserWindow, ipcMain, Menu, dialog } = require('electron');
const path = require('path');
const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged;

class SuperClaudeApp {
  constructor() {
    console.log('🚀 Initializing SuperClaude App...');
    console.log('🔧 Development mode:', isDev);
    this.mainWindow = null;
    this.isDev = isDev;
    this.setupApp();
  }

  setupApp() {
    console.log('⚙️ Setting up app...');
    app.whenReady().then(() => {
      console.log('✅ App is ready, creating window...');
      this.createWindow();
      this.setupMenu();
      this.setupIPC();
      
      app.on('activate', () => {
        console.log('🔄 App activated');
        if (BrowserWindow.getAllWindows().length === 0) {
          this.createWindow();
        }
      });
    });

    app.on('window-all-closed', () => {
      console.log('🚪 All windows closed');
      if (process.platform !== 'darwin') {
        app.quit();
      }
    });

    app.on('before-quit', () => {
      console.log('👋 App is quitting...');
    });
  }

  createWindow() {
    this.mainWindow = new BrowserWindow({
      width: 1400,
      height: 900,
      minWidth: 1200,
      minHeight: 800,
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        enableRemoteModule: false,
        webSecurity: true,
        devTools: this.isDev,
        preload: path.join(__dirname, 'preload.js')
      },
      icon: path.join(__dirname, '../assets/icon.png'),
      titleBarStyle: 'hiddenInset',
      show: false,
      frame: false,
      transparent: false
    });

    // Load the app
    if (this.isDev) {
      console.log('🔧 Development mode: Loading from http://localhost:5001');
      this.mainWindow.loadURL('http://localhost:5001').then(() => {
        console.log('✅ Successfully loaded the app');
        this.mainWindow.webContents.openDevTools();
      }).catch((error) => {
        console.error('❌ Failed to load the app:', error);
        // Show error dialog
        dialog.showErrorBox('Loading Error', `Failed to load the application: ${error.message}`);
      });
    } else {
      console.log('🚀 Production mode: Loading from file');
      const indexPath = path.join(__dirname, '../out/index.html');
      console.log('📁 Looking for index file at:', indexPath);
      
      // Check if the file exists
      const fs = require('fs');
      if (fs.existsSync(indexPath)) {
        this.mainWindow.loadFile(indexPath).catch((error) => {
          console.error('❌ Failed to load the app:', error);
          dialog.showErrorBox('Loading Error', `Failed to load the application: ${error.message}`);
        });
      } else {
        console.error('❌ Index file not found at:', indexPath);
        dialog.showErrorBox('Build Error', 'Application not built. Please run "pnpm run build" first.');
      }
    }

    // Show window when ready
    this.mainWindow.once('ready-to-show', () => {
      console.log('🎉 Window ready to show');
      this.mainWindow.show();
    });

    // Handle window closed
    this.mainWindow.on('closed', () => {
      console.log('👋 Window closed');
      this.mainWindow = null;
    });

    // Add error handling for web contents
    this.mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription, validatedURL) => {
      console.error('❌ Web contents failed to load:', {
        errorCode,
        errorDescription,
        validatedURL
      });
      dialog.showErrorBox('Loading Error', `Failed to load: ${errorDescription}`);
    });

    // Add console logging from renderer
    this.mainWindow.webContents.on('console-message', (event, level, message, line, sourceId) => {
      const levels = ['', 'INFO', 'WARN', 'ERROR'];
      console.log(`[Renderer ${levels[level]}] ${message} (${sourceId}:${line})`);
    });
  }

  setupMenu() {
    const template = [
      {
        label: 'File',
        submenu: [
          {
            label: 'New Project',
            accelerator: 'CmdOrCtrl+N',
            click: () => {
              this.mainWindow.webContents.send('new-project');
            }
          },
          {
            label: 'Open Project',
            accelerator: 'CmdOrCtrl+O',
            click: async () => {
              const result = await dialog.showOpenDialog(this.mainWindow, {
                properties: ['openDirectory']
              });
              if (!result.canceled) {
                this.mainWindow.webContents.send('open-project', result.filePaths[0]);
              }
            }
          },
          { type: 'separator' },
          {
            label: 'Preferences',
            accelerator: 'CmdOrCtrl+,',
            click: () => {
              this.mainWindow.webContents.send('open-preferences');
            }
          },
          { type: 'separator' },
          {
            label: 'Quit',
            accelerator: process.platform === 'darwin' ? 'Cmd+Q' : 'Ctrl+Q',
            click: () => {
              app.quit();
            }
          }
        ]
      },
      {
        label: 'Edit',
        submenu: [
          { role: 'undo' },
          { role: 'redo' },
          { type: 'separator' },
          { role: 'cut' },
          { role: 'copy' },
          { role: 'paste' },
          { role: 'selectall' }
        ]
      },
      {
        label: 'View',
        submenu: [
          { role: 'reload' },
          { role: 'forceReload' },
          { role: 'toggleDevTools' },
          { type: 'separator' },
          { role: 'resetZoom' },
          { role: 'zoomIn' },
          { role: 'zoomOut' },
          { type: 'separator' },
          { role: 'togglefullscreen' }
        ]
      },
      {
        label: 'Window',
        submenu: [
          { role: 'minimize' },
          { role: 'close' }
        ]
      },
      {
        label: 'Help',
        submenu: [
          {
            label: 'About SuperClaude',
            click: () => {
              dialog.showMessageBox(this.mainWindow, {
                type: 'info',
                title: 'About SuperClaude',
                message: 'SuperClaude Commercial',
                detail: 'AI Coding Assistant v1.0.0\n\nEnhanced SuperClaude Local for professional development.'
              });
            }
          },
          {
            label: 'Documentation',
            click: () => {
              this.mainWindow.webContents.send('open-docs');
            }
          },
          {
            label: 'Report Issue',
            click: () => {
              this.mainWindow.webContents.send('report-issue');
            }
          }
        ]
      }
    ];

    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
  }

  setupIPC() {
    // Window controls
    ipcMain.on('minimize-window', () => {
      this.mainWindow.minimize();
    });

    ipcMain.on('maximize-window', () => {
      if (this.mainWindow.isMaximized()) {
        this.mainWindow.unmaximize();
      } else {
        this.mainWindow.maximize();
      }
    });

    ipcMain.on('close-window', () => {
      this.mainWindow.close();
    });

    // File operations
    ipcMain.handle('select-directory', async () => {
      const result = await dialog.showOpenDialog(this.mainWindow, {
        properties: ['openDirectory']
      });
      return result.filePaths[0];
    });

    ipcMain.handle('select-file', async (event, options) => {
      const result = await dialog.showOpenDialog(this.mainWindow, {
        properties: ['openFile'],
        filters: options?.filters || []
      });
      return result.filePaths[0];
    });

    // AI processing
    ipcMain.handle('process-ai-request', async (event, request) => {
      try {
        // Here we'll integrate with the enhanced SuperClaude local
        // const { EnhancedSuperClaude } = require('../src/core/enhanced-superclaude');
        // const ai = new EnhancedSuperClaude();
        
        // const result = await ai.executeCommand(request.command, request.args);
        // return { success: true, data: result };
        return { success: true, data: { message: 'AI processing placeholder' } };
      } catch (error) {
        return { success: false, error: error.message };
      }
    });

    // Subscription management
    ipcMain.handle('check-subscription', async (event) => {
      // Check local subscription status
      const subscription = await this.getSubscriptionStatus();
      return subscription;
    });

    // Project management
    ipcMain.handle('save-project', async (event, projectData) => {
      // Save project to local storage or cloud
      return { success: true, projectId: Date.now().toString() };
    });

    ipcMain.handle('load-project', async (event, projectId) => {
      // Load project from storage
      return { success: true, data: {} };
    });
  }

  async getSubscriptionStatus() {
    // Mock subscription status - in real app, check against database/API
    return {
      plan: 'pro',
      status: 'active',
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      features: ['all-personas', 'mobile-dev', 'ai-ml', 'devops']
    };
  }
}

// Initialize the app
new SuperClaudeApp(); 