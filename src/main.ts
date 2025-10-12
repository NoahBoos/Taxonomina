import * as path from "node:path";

import {app, BrowserWindow, ipcMain} from "electron";
import {Database} from "./database/Database";
import {DictionaryRepository} from "./database/repositories/DictionaryRepository";
import { Dictionary } from "./database/models/Dictionary";
import {LanguageRepository} from "./database/repositories/LanguageRepository";
import {Language} from "./database/models/Language";
import {LoadTemplateAsString} from "./utils/main/TemplateManager";
import {SettingManager} from "./utils/main/SettingManager";
import {TaxonominaSettings} from "./interfaces/I_TaxonominaSettings";
import Dict = NodeJS.Dict;

export let settings: TaxonominaSettings;
async function InitializeSetting() {
    settings = await SettingManager.LoadSettings();
}

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
    InitializeSetting().then(r => {
        Database.InitializeDatabase();
    })
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
});

ipcMain.handle("txnmAPI:settings:expose", () => {
   return settings;
});

ipcMain.handle("txnmAPI:settings:save", () => {
    return SettingManager.SaveSetting(settings);
});

ipcMain.handle("txnmAPI:settings:load", () => {
   return SettingManager.LoadSettings();
});

ipcMain.handle("txnmAPI:settings:update", (event, key: keyof TaxonominaSettings, value: any) => {
   return SettingManager.UpdateSetting(key, value);
});

ipcMain.handle("txnmAPI:repositories:dictionary:readAll", () => {
   return DictionaryRepository.ReadAll();
});

ipcMain.handle("txnmAPI:repositories:dictionary:readOne", (event, dictionaryId: number) => {
    return DictionaryRepository.ReadOne(dictionaryId);
});

ipcMain.handle("txnmAPI:repositories:dictionary:create", (event, data: { name: string; description: string }) => {
    return DictionaryRepository.Create(new Dictionary(0, data.name, data.description));
});

ipcMain.handle("txnmAPI:repositories:dictionary:update", (event, rawDictionary: Dictionary) => {
    const dictionary: Dictionary = Dictionary.Hydrate(rawDictionary);
    return DictionaryRepository.Update(dictionary);
});

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

ipcMain.handle("txnmAPI:repositories:language:delete", (event, rawLanguage: Language) => {
    const language: Language = Language.Hydrate(rawLanguage);
    return LanguageRepository.Delete(language);
});