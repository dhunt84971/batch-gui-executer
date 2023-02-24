
const {
  app,
  BrowserWindow,
  ipcMain
} = require("electron");

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win;

//#region MAIN WINDOW FUNCTION
function createWindow() {
  // Create the browser window.
  win = new BrowserWindow({
    width: 1090,
    height: 700,
    show: false,
    webviewTag: true,
    backgroundColor: "#fff",
    webPreferences: {
      nodeIntegration: true,
      webviewTag: true,
      enableRemoteModule: true,
    },
    icon: __dirname + '/images/app.ico'
  });

  // and load the index.html of the app.
  win.loadFile("batch-gui-executer.html");

  // Remove Window Menu
  win.setMenu(null);
  win.autoHideMenuBar = true;
  win.setMenuBarVisibility(false);

  // Open the DevTools.
  
  devtools = new BrowserWindow();
  // Open the DevTools.
  win.webContents.setDevToolsWebContents(devtools.webContents);
  win.webContents.openDevTools({mode: 'detach'});
  

  win.once('ready-to-show', () => {
    //win.show();
  });
  // Emitted when the window is closed.
  win.on("closed", () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null;
  });
}
//#endregion MAIN WINDOW FUNCTION

//#region INITIALIZATION FUNCTIONS
// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", createWindow);

// Quit when all windows are closed.
app.on("window-all-closed", () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow();
  }
});
//#endregion INITIALIZATION FUNCTIONS

//#region IPC
ipcMain.on("showWindow", (event, message) => {
  let size = message["size"].split("x");
  let winWidth = Number(size[0]);
  let winHeight = Number(size[1]);
  win.show();
  win.setSize(winWidth,winHeight);
  win.setTitle(message["title"]);
});



//#endregion IPC