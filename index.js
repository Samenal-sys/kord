const { app, BrowserWindow, session, protocol, net } = require('electron');
const http = require('http');
const os = require('os');
const path = require('path');
const fs = require('fs');
const { pathToFileURL } = require('url');
const handler = require('serve-handler');

// Fix for Windows: Use standard AppData Roaming instead of forcing ~/.local
const dataDir = os.platform() === 'win32' 
  ? path.join(app.getPath('appData'), 'kord', 'data')
  : path.join(os.homedir(), '.local', 'kord', 'data');
app.setPath('userData', dataDir);

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
      standard: true,      
      secure: true,        
      allowServiceWorkers: true,
      supportFetchAPI: true,
      corsEnabled: true
    }
  }
]);

async function createWindow() {
  // await createServer(); // im turning this off to try smth
  
  const customSession = session.fromPartition('persist:kord_session');

  customSession.protocol.handle('kord', (request) => {
    const parsedUrl = new URL(request.url);

    // Verify origin matches local.app
    if (parsedUrl.hostname === 'local.app') {
      let reqPath = parsedUrl.pathname;
      if (reqPath === '/' || reqPath === '') reqPath = '/index.html';

      // Map request to absolute file path inside ./appdir safely
      const safePath = path.normalize(reqPath).replace(/^(\.\.[\/\\])+/, '');
      const filePath = path.join(__dirname, 'appdir', safePath);
      
      return net.fetch(pathToFileURL(filePath).toString());
    }

    return new Response('Not Found', { status: 404 });
  });

  customSession.webRequest.onBeforeSendHeaders(
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

  win.webContents.on('dom-ready', async () => {
    // Safely inject Open Sans as a DOM link element instead of relying on unreliable insertCSS @imports
    win.webContents.executeJavaScript(`
      if (!document.getElementById('open-sans-font')) {
        const link = document.createElement('link');
        link.id = 'open-sans-font';
        link.rel = 'stylesheet';
        link.href = 'https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300..800;1,300..800&display=swap';
        document.head.appendChild(link);
      }
    `);

    win.webContents.insertCSS(`
      *, *::before, *::after {
        cursor: none !important;
        font-family: 'Open Sans', sans-serif !important;
      }
      ::-webkit-scrollbar {
        display: none !important;
        width: 0 !important;
        height: 0 !important;
      }
      html, body, * {
        scrollbar-width: none !important;
      }
    `); 

    // MOD SYSTEM: Inject every .css / .js file inside the "mods" folder
    const modsDir = path.join(app.getPath('userData'), 'mods');
    try {
      if (fs.existsSync(modsDir)) {
        const files = await fs.promises.readdir(modsDir);
        for (const file of files) {
          const filePath = path.join(modsDir, file);
          const ext = path.extname(file).toLowerCase();
          
          if (ext === '.css') {
            const cssContent = await fs.promises.readFile(filePath, 'utf8');
            await win.webContents.insertCSS(cssContent);
          } else if (ext === '.js') {
            const jsContent = await fs.promises.readFile(filePath, 'utf8');
            await win.webContents.executeJavaScript(jsContent);
          }
        }
      }
    } catch (err) {
      console.error('Failed to load mods:', err);
    }
  });
}
app.whenReady().then(createWindow);

if (typeof window !== 'undefined') {
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
}