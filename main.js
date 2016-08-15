const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({useContentSize: true, titleBarStyle: "hidden", resizable: false});
  //mainWindow.setMenu(null);
  mainWindow.loadURL(`file://${__dirname}/index.html`);
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.on('ready', createWindow);
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});
