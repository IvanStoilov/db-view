import path from "path";
import "./connections/storage";
import { app, BrowserWindow, globalShortcut } from "electron";
import { ConnectionManager } from "./connections/ConnectionManager";

let mainWindow: BrowserWindow;

let connectionManager: ConnectionManager;

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      sandbox: false,
    },
  });

  // and load the index.html of the app.
  if (app.isPackaged) {
    mainWindow.loadFile("index.html"); // prod
  } else {
    mainWindow.loadURL("http://localhost:3006"); // dev

    // Open the DevTools.
    mainWindow.webContents.openDevTools();
  }

  mainWindow.on("close", () => {
    connectionManager.closeAllConnection();
  });

  return mainWindow;
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // await session.defaultSession.loadExtension(
  //   "/Users/ivan/Library/Application Support/Google/Chrome/Default/Extensions/fmkadmapgofadopljbjfkapdkoienihi/4.27.8_0/"
  // );

  connectionManager = new ConnectionManager();

  app.on("activate", function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", function () {
  connectionManager.closeAllConnection();

  if (process.platform !== "darwin") app.quit();
});

app.on("browser-window-focus", () => {
  globalShortcut.register("CommandOrControl+R", handleReload);
  globalShortcut.register("F5", handleReload);
});

app.on("browser-window-blur", function () {
  globalShortcut.unregister("CommandOrControl+R");
  globalShortcut.unregister("F5");
});

function handleReload() {
  if (!app.isPackaged) {
    connectionManager.closeAllConnection();
    mainWindow.reload();
  }
}

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
