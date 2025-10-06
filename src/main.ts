import * as path from "node:path";

import {app, BrowserWindow, ipcMain} from "electron";
import {Database} from "./database/Database";
import {LoadTemplate} from "./utils/LoadTemplate";
import {DictionaryRepository} from "./database/repositories/DictionaryRepository";
import { Dictionary } from "./database/models/Dictionary";

const CreateIndexWindow = () => {
    const window = new BrowserWindow({
        width: 800,
        height: 600,
        frame: true,
        webPreferences: {
            preload: path.join(__dirname, "views", "pages", "index", "preload.js"),
            // devTools: false
        }
    });
    Database.InitializeDatabase()
    window.loadFile(path.join(__dirname, "views", "pages", "index", "index.html"));
    console.log("[Main] - Loaded");
}

app.whenReady().then(() => {
    CreateIndexWindow();

    app.on("activate", () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            CreateIndexWindow();
        }
    })
})

ipcMain.handle("txnmAPI:loadTemplate", (event, path: string) => {
    return LoadTemplate(path);
})

ipcMain.handle("txnmAPI:repositories:dictionary:create", (event, data: { name: string; description: string }) => {
    return DictionaryRepository.Create(new Dictionary(0, data.name, data.description));
})