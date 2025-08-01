import { app, BrowserWindow } from 'electron';
import * as path from 'path';
import { spawn, ChildProcess } from 'child_process';

const isDev = process.env.NODE_ENV === 'development';

let pythonProc: ChildProcess | null = null;

// function startPythonDetector() {
//   const pythonExecutable = path.join(__dirname, '..', '..', 'backend', 'venv', 'Scripts', 'python.exe');
//   const scriptPath = path.join(__dirname, '..', '..', 'backend', 'app', 'eye_detector.py');
//   console.log('Attempting to run Python:', pythonExecutable);
//   console.log('Attempting to run script:', scriptPath);

//   pythonProc = spawn(pythonExecutable, [scriptPath], {
//     stdio: 'inherit',
//     shell: false,
//     windowsHide: true,
//   });

//   pythonProc.on('error', (err) => {
//     console.error('Failed to start Python eye detector:', err);
//   });

//   pythonProc.on('exit', (code, signal) => {
//     console.log(`Python eye detector exited with code ${code}, signal ${signal}`);
//   });
// }

// function stopPythonDetector() {
//   if (pythonProc) {
//     pythonProc.kill();
//     pythonProc = null;
//   }
// }

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  if (isDev) {
    win.loadURL('http://localhost:5173');
    win.webContents.openDevTools();
  } else {
    const indexPath = path.join(__dirname, '../dist/index.html');
    console.log('PROD: Loading file ->', indexPath);
    win.loadFile(indexPath);
  }
}

app.whenReady().then(() => {
  //startPythonDetector();  // Start Python backend automatically
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  //stopPythonDetector(); // Stop Python backend on app exit
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('before-quit', () => {
  //stopPythonDetector(); // Just in case, stop Python when quitting
});
