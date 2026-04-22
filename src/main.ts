import { app, BrowserWindow } from "electron";
import path from "node:path";
import started from "electron-squirrel-startup";

if (started) {
  app.quit();
}

const customUserDataDir = process.env.MINUTELY_USER_DATA_DIR;
if (customUserDataDir) {
  app.setPath("userData", customUserDataDir);
}

const createWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    show: false,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
    mainWindow.webContents.once("did-finish-load", () => {
      mainWindow.webContents.openDevTools({ mode: "detach" });
    });
  } else {
    mainWindow.loadFile(
      path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`)
    );
  }

  mainWindow.webContents.on("before-input-event", (event, input) => {
    const isDevToolsShortcut =
      input.key === "F12" ||
      (input.control || input.meta) && input.shift && input.key.toLowerCase() === "i";

    if (isDevToolsShortcut) {
      event.preventDefault();
      mainWindow.webContents.toggleDevTools();
    }
  });

  mainWindow.once("ready-to-show", () => {
    mainWindow.show();
  });
};

app.on("ready", createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
