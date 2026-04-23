const { app, BrowserWindow, session } = require('electron');

let mainWindow;

// Spoof a current, clean Chrome UA before anything loads.
// Electron's default UA contains "Electron/x.y.z" which trips Google's
// "this browser may not be secure" block on signin. Setting it here
// (before app.ready) ensures it's applied to every request/session.
// Spoof as Microsoft Edge — same Chromium APIs so fingerprint matches,
// but Google's signin flow treats Edge as a legit 3rd-party browser
// instead of sniffing it the way it sniffs bare Chrome/Electron.
const CHROME_UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36 Edg/133.0.0.0';
app.userAgentFallback = CHROME_UA;

// Nuke the "Electron" signature from any command-line hints too.
app.commandLine.appendSwitch('disable-features', 'IsolateOrigins,site-per-process,AutomationControlled');
// THE big one — Google's signin blocks anything with AutomationControlled
// in blink features. Disabling it at the blink level is the known fix.
app.commandLine.appendSwitch('disable-blink-features', 'AutomationControlled');
// Stop Electron from advertising itself in enabled features.
app.commandLine.appendSwitch('enable-features', 'NetworkService,NetworkServiceInProcess');

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    title: 'Shrew',
    icon: 'Untitled.png',
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      webviewTag: true,
      webSecurity: false,  // Disable CORS
      partition: 'persist:shrew'  // Persistent session
    },
    frame: true,
    titleBarStyle: 'default'
  });

  // Set user agent to look like a regular Chrome browser
  session.defaultSession.setUserAgent(CHROME_UA);

  // Strip Electron from UA on every outgoing request + add modern
  // client-hint headers so Google accepts the signin flow.
  const stripElectron = (ua) => ua.replace(/ ?Electron\/[^ ]+/gi, '').replace(/ ?Shrew\/[^ ]+/gi, '').trim();

  session.defaultSession.webRequest.onBeforeSendHeaders((details, callback) => {
    const headers = details.requestHeaders;
    if (headers['User-Agent']) {
      headers['User-Agent'] = stripElectron(headers['User-Agent']);
      // If it still doesn't look like Chrome, force the UA we want.
      if (!/Chrome\//.test(headers['User-Agent'])) {
        headers['User-Agent'] = CHROME_UA;
      }
    } else {
      headers['User-Agent'] = CHROME_UA;
    }

    // Modern Edge client hints — must match the UA string above.
    headers['sec-ch-ua'] = '"Chromium";v="133", "Not(A:Brand";v="24", "Microsoft Edge";v="133"';
    headers['sec-ch-ua-mobile'] = '?0';
    headers['sec-ch-ua-platform'] = '"Windows"';
    headers['sec-ch-ua-platform-version'] = '"15.0.0"';
    headers['sec-ch-ua-full-version'] = '"133.0.3065.82"';
    headers['sec-ch-ua-arch'] = '"x86"';
    headers['sec-ch-ua-bitness'] = '"64"';
    headers['sec-ch-ua-model'] = '""';

    // Drop the CORS-busting header tweaks from the original code for
    // auth flows — killing Origin/Referer breaks Google OAuth.
    callback({ requestHeaders: headers });
  });

  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    // Let responses through untouched. The previous version was
    // rewriting response headers with the REQUEST headers, which
    // was a bug and also contributed to the "not secure" vibe.
    callback({ responseHeaders: details.responseHeaders });
  });

  mainWindow.loadFile('index.html');
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
