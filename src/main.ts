import * as path from "node:path";

import {app, BrowserWindow, ipcMain} from "electron";
import {Database} from "./database/Database";
import {LoadTemplate} from "./utils/LoadTemplate";
import {DictionaryRepository} from "./database/repositories/DictionaryRepository";
import { Dictionary } from "./database/models/Dictionary";
import {LanguageRepository} from "./database/repositories/LanguageRepository";
import {Language} from "./database/models/Language";

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

ipcMain.handle("txnmAPI:repositories:language:readAll", (): Language[] => {
   return LanguageRepository.ReadAll();
});

ipcMain.handle("txnmAPI:repositories:language:create", (event, data: { iso_639_1: string, iso_639_3: string, is_conlang: boolean, name_native: string, name_local: string, direction: string }) => {
    return LanguageRepository.Create(new Language(0, data.iso_639_1, data.iso_639_3, data.is_conlang, data.name_native, data.name_local, data.direction));
});

ipcMain.handle("txnmAPI:repositories:language:update", (event, rawLanguage: Language) => {
    const language: Language = Language.Hydrate(rawLanguage);
    return LanguageRepository.Update(language);
});