const { app, globalShortcut, BrowserWindow } = require('electron');

let mainWindow;
// app.commandLine.appendSwitch('disable-site-isolation-trials')
function createWindow() {
  mainWindow = new BrowserWindow({
    autoHideMenuBar: false,
    frame: true,
    // titleBarStyle: 'hidden',
    width: 940,
    height: 680,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true,
      nodeIntegrationInWorker: true,
      webSecurity: false
    }
  });

  mainWindow.loadURL(`file://${__dirname}/index.html`);
  // mainWindow.webContents.openDevTools();

  mainWindow.on("close", () => {
    mainWindow.webContents.send("stop-server");
  });

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

app.on("window-all-closed", function () {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.whenReady().then(() => {
  globalShortcut.register("Alt+CommandOrControl+L", () => {
    mainWindow.webContents.send("show-server-log");
  })
}).then(createWindow);
