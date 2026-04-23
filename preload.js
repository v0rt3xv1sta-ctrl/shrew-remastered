// Preload script — runs in the webview's renderer before any page JS.
// Goal: make the page-level JS fingerprint look like real Chrome so
// Google's "this browser may not be secure" detection doesn't trip.

(() => {
  // 1. navigator.webdriver — real Chrome has this undefined. Electron/CDP
  //    leaks true, which is the #1 signal Google uses to block signin.
  try {
    Object.defineProperty(Navigator.prototype, 'webdriver', {
      get: () => undefined,
      configurable: true,
    });
  } catch (_) {}

  // 2. window.chrome — real Chrome exposes chrome.runtime + chrome.app.
  //    Electron's webview has a partial shim; fill in the gaps.
  try {
    if (!window.chrome) window.chrome = {};
    if (!window.chrome.runtime) {
      window.chrome.runtime = {
        OnInstalledReason: {},
        OnRestartRequiredReason: {},
        PlatformArch: {},
        PlatformNaclArch: {},
        PlatformOs: {},
        RequestUpdateCheckStatus: {},
        connect: () => ({}),
        sendMessage: () => ({}),
      };
    }
    if (!window.chrome.app) {
      window.chrome.app = {
        isInstalled: false,
        InstallState: {
          DISABLED: 'disabled',
          INSTALLED: 'installed',
          NOT_INSTALLED: 'not_installed',
        },
        RunningState: {
          CANNOT_RUN: 'cannot_run',
          READY_TO_RUN: 'ready_to_run',
          RUNNING: 'running',
        },
        getDetails: () => null,
        getIsInstalled: () => false,
      };
    }
    if (!window.chrome.csi) window.chrome.csi = () => ({});
    if (!window.chrome.loadTimes) window.chrome.loadTimes = () => ({});
  } catch (_) {}

  // 3. Plugins — headless/electron returns empty array; real Chrome
  //    returns a PluginArray with Chrome PDF Viewer etc.
  try {
    Object.defineProperty(Navigator.prototype, 'plugins', {
      get: () => {
        const plugins = [
          { name: 'PDF Viewer', filename: 'internal-pdf-viewer', description: 'Portable Document Format' },
          { name: 'Chrome PDF Viewer', filename: 'internal-pdf-viewer', description: 'Portable Document Format' },
          { name: 'Chromium PDF Viewer', filename: 'internal-pdf-viewer', description: 'Portable Document Format' },
          { name: 'Microsoft Edge PDF Viewer', filename: 'internal-pdf-viewer', description: 'Portable Document Format' },
          { name: 'WebKit built-in PDF', filename: 'internal-pdf-viewer', description: 'Portable Document Format' },
        ];
        plugins.item = (i) => plugins[i];
        plugins.namedItem = (n) => plugins.find((p) => p.name === n) || null;
        plugins.refresh = () => {};
        return plugins;
      },
      configurable: true,
    });
  } catch (_) {}

  // 4. Languages — make sure it's a plausible list.
  try {
    Object.defineProperty(Navigator.prototype, 'languages', {
      get: () => ['en-US', 'en'],
      configurable: true,
    });
  } catch (_) {}

  // 5. Permissions API — Electron returns 'denied' for notifications in
  //    ways that don't match real Chrome; patch to match.
  try {
    const origQuery = window.navigator.permissions && window.navigator.permissions.query;
    if (origQuery) {
      window.navigator.permissions.query = (params) =>
        params && params.name === 'notifications'
          ? Promise.resolve({ state: Notification.permission, onchange: null })
          : origQuery.call(window.navigator.permissions, params);
    }
  } catch (_) {}

  // 6. WebGL vendor/renderer — real Chrome reports a GPU vendor, some
  //    headless envs report "Google Inc." which is a flag.
  try {
    const getParam = WebGLRenderingContext.prototype.getParameter;
    WebGLRenderingContext.prototype.getParameter = function (parameter) {
      // UNMASKED_VENDOR_WEBGL
      if (parameter === 37445) return 'Intel Inc.';
      // UNMASKED_RENDERER_WEBGL
      if (parameter === 37446) return 'Intel Iris OpenGL Engine';
      return getParam.call(this, parameter);
    };
  } catch (_) {}

  // 7. Strip any leftover "Electron" string from navigator.userAgent
  //    in case the UA override didn't take.
  try {
    const ua = navigator.userAgent.replace(/ ?Electron\/[^ ]+/gi, '').replace(/ ?Shrew\/[^ ]+/gi, '').trim();
    if (ua !== navigator.userAgent) {
      Object.defineProperty(Navigator.prototype, 'userAgent', {
        get: () => ua,
        configurable: true,
      });
    }
  } catch (_) {}
})();
