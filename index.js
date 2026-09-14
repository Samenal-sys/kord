const { app, BrowserWindow, session } = require('electron');
const http = require('http');
const os = require('os');
const path = require('path');
const handler = require('serve-handler');
const dataDir = path.join(os.homedir(), '.local', 'kord', 'data');
app.setPath('userData',dataDir);
let server;
let PORT = 51473; 

function createServer() {
  return new Promise((resolve) => {
    server = http.createServer((request, response) => {
      return handler(request, response, {
        public: path.join(__dirname, 'appdir')
      });
    });

    server.listen(PORT, '127.0.0.1', () => {
      PORT = server.address().port;
      resolve();
    });
  });
}

protocol.registerSchemesAsPrivileged([
  {
    scheme: 'kord',
    privileges: {
      standard: true,      // Allows standard web storage (localStorage, IndexedDB)
      secure: true,        // Treats origin as HTTPS (prevents crypto API errors)
      allowServiceWorkers: true,
      supportFetchAPI: true,
      corsEnabled: true
    }
  }
]);

async function createWindow() {
  // await createServer(); // im turning this off to try smth

protocol.handle('kord', (request) => {
    const parsedUrl = new URL(request.url);

    // Verify origin matches local.app
    if (parsedUrl.hostname === 'local.app') {
      let reqPath = parsedUrl.pathname;
      if (reqPath === '/' || reqPath === '') reqPath = '/index.html';

      // Map request to absolute file path inside ./appdir
      const filePath = path.join(__dirname, 'appdir', path.normalize(reqPath));
      return net.fetch(pathToFileURL(filePath).toString());
    }

    return new Response('Not Found', { status: 404 });
  });



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
      offscreen: false,
      partition: 'persist:kord_session'
    }
  });

  win.loadURL(`kord://local.app/index.html`)
  win.setIgnoreMouseEvents(true, { forward: true });
  win.webContents.on('did-finish-load', () => {
    win.webContents.insertCSS(`
      *, *::before, *::after {
        cursor: none !important;
      }
      ::-webkit-scrollbar {
        display: none !important;
        width: 0 !important;
        height: 0 !important;
      }
      html, body, * {
        scrollbar-width: none !important;
      }
    `); });
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

