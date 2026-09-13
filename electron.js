const { app, BrowserWindow } = require('electron');

function createWindow() {
  const win = new BrowserWindow({
    width: 240,
    height: 320,
    webPreferences: {
      webSecurity: false, 
      nodeIntegration: false,
      contextIsolation: true,
      backgroundThrottling: true, 
      offscreen: false
    }
  });

  win.loadFile('appdir/index.html');
}

app.whenReady().then(createWindow);

window.addEventListener('keydown', (event) => {
  // Check for Ctrl + Left or Ctrl + Right
  if (event.ctrlKey && (event.key === 'ArrowLeft' || event.key === 'ArrowRight')) {
    event.preventDefault(); // Prevent standard cursor/history movement

    const targetKey = event.key === 'ArrowLeft' ? 'SoftLeft' : 'SoftRight';

    // Dispatch custom keyboard event with target key name
    const syntheticEvent = new KeyboardEvent('keydown', {
      key: targetKey,
      code: targetKey,
      bubbles: true,
      cancelable: true
    });

    event.target.dispatchEvent(syntheticEvent);
  }
});