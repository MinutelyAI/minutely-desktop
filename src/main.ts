import { app, BrowserWindow, nativeImage } from "electron";
import path from "node:path";
import fs from "node:fs";
import started from "electron-squirrel-startup";

if (started) {
  app.quit();
}

const customUserDataDir = process.env.MINUTELY_USER_DATA_DIR;
if (customUserDataDir) {
  app.setPath("userData", customUserDataDir);
}

const createWindow = () => {
  const rootPath = process.cwd();
  const pngPath = path.resolve(rootPath, "assets", "icon.png");
  const icoPath = path.resolve(rootPath, "assets", "icon.ico");
  
  let iconPath = app.isPackaged
    ? path.join(process.resourcesPath, "assets", "icon.ico")
    : pngPath;

  let image = nativeImage.createFromPath(iconPath);

  if (!app.isPackaged && image.isEmpty()) {
    console.log("PNG icon failed or missing, trying ICO...");
    iconPath = icoPath;
    image = nativeImage.createFromPath(iconPath);
  }

  if (image.isEmpty()) {
    console.error("Failed to load both PNG and ICO icons.");
    console.log("Paths tried:", pngPath, icoPath);
  }

  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    show: false,
    icon: image.isEmpty() ? undefined : image,
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
