const { app, BrowserWindow, session } = require('electron');
const http = require('http');
const path = require('path');
const handler = require('serve-handler');
let server;
let PORT = 5173; // pick port that free

function createServer() {
  return new Promise((resolve) => {
    server = http.createServer((request, response) => {
      return handler(request, response, {
        public: path.join(__dirname, 'appdir')
      });
    });

    server.listen(0, '127.0.0.1', () => {
      PORT = server.address().port;
      resolve();
    });
  });
}


async function createWindow() {
  await createServer();
  session.defaultSession.webRequest.onBeforeSendHeaders(
    { urls: ['https://discord.com/*', 'https://*.discord.gg/*'] },
    (details, callback) => {
      const headers = details.requestHeaders;

      // Forcefully apply the required headers natively
      headers['Origin'] = 'https://discord.com';
      headers['Referer'] = 'https://discord.com/';
      headers['Accept-Encoding'] = 'gzip, deflate, br, zstd';
      
      // Pass along Discord authorization & super properties from renderer XHR
      callback({ cancel: false, requestHeaders: headers });
    }
  );
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

  win.loadURL(`http://127.0.0.1:${PORT}/index.html`)
}
app.whenReady().then(createWindow);

window.addEventListener('keydown', (event) => {
  // This function to forward keys is AI made btw
  if (event.ctrlKey && (event.key === 'ArrowLeft' || event.key === 'ArrowRight')) {
    event.preventDefault(); 

    const targetKey = event.key === 'ArrowLeft' ? 'SoftLeft' : 'SoftRight';

    const syntheticEvent = new KeyboardEvent('keydown', {
      key: targetKey,
      code: targetKey,
      bubbles: true,
      cancelable: true
    });

    event.target.dispatchEvent(syntheticEvent);
  }
});