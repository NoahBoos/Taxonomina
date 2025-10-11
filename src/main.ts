import * as path from "node:path";

import {app, BrowserWindow, ipcMain} from "electron";
import {Database} from "./database/Database";
import {DictionaryRepository} from "./database/repositories/DictionaryRepository";
import { Dictionary } from "./database/models/Dictionary";
import {LanguageRepository} from "./database/repositories/LanguageRepository";
import {Language} from "./database/models/Language";
import {LoadTemplateAsString} from "./utils/main/TemplateManager";

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

ipcMain.handle("txnmAPI:loadTemplateAsString", (event, templatePath: string) => {
    return LoadTemplateAsString(templatePath);
})

ipcMain.handle("txnmAPI:repositories:dictionary:create", (event, data: { name: string; description: string }) => {
    return DictionaryRepository.Create(new Dictionary(0, data.name, data.description));
})

ipcMain.handle("txnmAPI:repositories:language:readAll", (): Language[] => {
   return LanguageRepository.ReadAll();
});

ipcMain.handle("txnmAPI:repositories:language:create", (event, rawLanguage: Language) => {
    const language: Language = Language.Hydrate(rawLanguage);
    return LanguageRepository.Create(language);
});

ipcMain.handle("txnmAPI:repositories:language:update", (event, rawLanguage: Language) => {
    const language: Language = Language.Hydrate(rawLanguage);
    return LanguageRepository.Update(language);
});