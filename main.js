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
      webSecurity: false  // Disable CORS
    },
    frame: true,
    titleBarStyle: 'default'
  });

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
    callback({ responseHeaders: details.responseHeaders });
  });

  mainWindow.loadFile('index.html');
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});