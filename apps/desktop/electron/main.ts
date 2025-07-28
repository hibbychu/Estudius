import { app, BrowserWindow } from 'electron';
import * as path from 'path';
import * as url from 'url';

const isDev = process.env.NODE_ENV === 'development';

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'), // must match the built preload script
      contextIsolation: true, // secure context for renderer
      nodeIntegration: false, // prevents node access in renderer
    },
  });

  if (isDev) {
    win.loadURL('http://localhost:5173');
    win.webContents.openDevTools();
  } else {
    // Load the built React app
    const indexPath = path.join(__dirname, '../dist/index.html');
    console.log('PROD: Loading file ->', indexPath);
    win.loadFile(indexPath);
  }
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
