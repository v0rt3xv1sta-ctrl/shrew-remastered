const { app, BrowserWindow, session } = require('electron');

let mainWindow;

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
  session.defaultSession.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

  // Disable CORS for all requests
  session.defaultSession.webRequest.onBeforeSendHeaders((details, callback) => {
    details.requestHeaders['Origin'] = null;
    details.requestHeaders['Referer'] = null;
    callback({ requestHeaders: details.requestHeaders });
  });

  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    if (details.responseHeaders) {
      details.responseHeaders['Access-Control-Allow-Origin'] = ['*'];
      details.responseHeaders['Access-Control-Allow-Headers'] = ['*'];
    }
    callback({ responseHeaders: details.requestHeaders });
  });

  mainWindow.loadFile('index.html');
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});