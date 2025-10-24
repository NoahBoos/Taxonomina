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
import {GrammaticalCategory} from "./database/models/GrammaticalCategory";
import {GrammaticalCategoryRepository} from "./database/repositories/GrammaticalCategoryRepository";
import {GrammaticalGenreRepository} from "./database/repositories/GrammaticalGenreRepository";
import {GrammaticalGenre} from "./database/models/GrammaticalGenre";
import {Definition} from "./database/models/Definition";
import {DefinitionRepository} from "./database/repositories/DefinitionRepository";
import {Entry} from "./database/models/Entry";
import {EntryRepository} from "./database/repositories/EntryRepository";

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

ipcMain.handle("txnmAPI:settings:save", async () => {
    return await SettingManager.SaveSetting(settings);
});

ipcMain.handle("txnmAPI:settings:load", async () => {
   return await SettingManager.LoadSettings();
});

ipcMain.handle("txnmAPI:settings:update", async (event, key: keyof TaxonominaSettings, value: any) => {
   return await SettingManager.UpdateSetting(key, value);
});

ipcMain.handle("txnmAPI:repositories:definition:readAll", (): Definition[] => {
    return DefinitionRepository.ReadAll();
});

ipcMain.handle("txnmAPI:repositories:definition:readOne", (event, definitionId: number) => {
    return DefinitionRepository.ReadOne(definitionId);
});

ipcMain.handle("txnmAPI:repositories:definition:create", (event, rawDefinition: Definition) => {
    const definition: Definition = Definition.Hydrate(rawDefinition)
    return DefinitionRepository.Create(definition);
});

ipcMain.handle("txnmAPI:repositories:definition:update", (event, rawDefinition: Definition) => {
    const definition: Definition = Definition.Hydrate(rawDefinition)
    return DefinitionRepository.Update(definition);
});

ipcMain.handle("txnmAPI:repositories:definition:delete", (event, rawDefinition: Definition) => {
    const definition: Definition = Definition.Hydrate(rawDefinition)
    return DefinitionRepository.Delete(definition);
});

ipcMain.handle("txnmAPI:repositories:dictionary:readAll", () => {
   return DictionaryRepository.ReadAll();
});

ipcMain.handle("txnmAPI:repositories:dictionary:readAllButOne", (event, rawDictionary: Dictionary) => {
    const dictionary: Dictionary = Dictionary.Hydrate(rawDictionary);
    return DictionaryRepository.ReadAllButOne(dictionary);
})

ipcMain.handle("txnmAPI:repositories:dictionary:readOne", (event, dictionaryId: number) => {
    return DictionaryRepository.ReadOne(dictionaryId);
});

ipcMain.handle("txnmAPI:repositories:dictionary:create", (event, rawDictionary: Dictionary) => {
    const dictionary: Dictionary = Dictionary.Hydrate(rawDictionary);
    return DictionaryRepository.Create(dictionary);
});

ipcMain.handle("txnmAPI:repositories:dictionary:update", (event, rawDictionary: Dictionary) => {
    const dictionary: Dictionary = Dictionary.Hydrate(rawDictionary);
    return DictionaryRepository.Update(dictionary);
});

ipcMain.handle("txnmAPI:repositories:dictionary:delete", (event, rawDictionary: Dictionary) => {
    const dictionary: Dictionary = Dictionary.Hydrate(rawDictionary);
    return DictionaryRepository.Delete(dictionary);
});

ipcMain.handle("txnmAPI:repositories:entry:readAll", (): Entry[] => {
    return EntryRepository.ReadAll();
});

ipcMain.handle("txnmAPI:repositories:entry:readAllByGlobalTranslation", (event, rawEntry: Entry) => {
   const entry: Entry = Entry.Hydrate(rawEntry);
   return EntryRepository.ReadAllByGlobalTranslation(entry);
});

ipcMain.handle("txnmAPI:repositories:entry:readAllByLocalTranslation", (event, rawDefinition: Definition) => {
    const definition: Definition = Definition.Hydrate(rawDefinition);
    return EntryRepository.ReadAllByLocalTranslation(definition);
})

ipcMain.handle("txnmAPI:repositories:entry:readOne", (event, entryId: number) => {
    return EntryRepository.ReadOne(entryId);
});

ipcMain.handle("txnmAPI:repositories:entry:create", (event, rawEntry: Entry) => {
    const entry: Entry = Entry.Hydrate(rawEntry);
    return EntryRepository.Create(entry);
});

ipcMain.handle("txnmAPI:repositories:entry:update", (event, rawEntry: Entry) => {
    const entry: Entry = Entry.Hydrate(rawEntry);
    return EntryRepository.Update(entry);
});

ipcMain.handle("txnmAPI:repositories:entry:delete", (event, rawEntry: Entry) => {
    const entry: Entry = Entry.Hydrate(rawEntry);
    return EntryRepository.Delete(entry);
});

ipcMain.handle("txnmAPI:repositories:grammaticalCategory:readAll", (): GrammaticalCategory[] => {
    return GrammaticalCategoryRepository.ReadAll();
});

ipcMain.handle("txnmAPI:repositories:grammaticalCategory:readAllByEntry", (event, rawEntry: Entry): GrammaticalCategory[] => {
    const entry: Entry = Entry.Hydrate(rawEntry);
    return GrammaticalCategoryRepository.ReadAllByEntry(entry);
});

ipcMain.handle("txnmAPI:repositories:grammaticalCategory:readOne", (event, gramCatId: number) => {
    return GrammaticalCategoryRepository.ReadOne(gramCatId);
});

ipcMain.handle("txnmAPI:repositories:grammaticalCategory:create", (event, rawGramCat: GrammaticalCategory) => {
    const gramCat: GrammaticalCategory = GrammaticalCategory.Hydrate(rawGramCat)
    return GrammaticalCategoryRepository.Create(gramCat);
});

ipcMain.handle("txnmAPI:repositories:grammaticalCategory:update", (event, rawGramCat: GrammaticalCategory) => {
    const gramCat: GrammaticalCategory = GrammaticalCategory.Hydrate(rawGramCat)
    return GrammaticalCategoryRepository.Update(gramCat);
});

ipcMain.handle("txnmAPI:repositories:grammaticalCategory:delete", (event, rawGramCat: GrammaticalCategory) => {
    const gramCat: GrammaticalCategory = GrammaticalCategory.Hydrate(rawGramCat)
    return GrammaticalCategoryRepository.Delete(gramCat);
});

ipcMain.handle("txnmAPI:repositories:grammaticalGenre:readAll", (): GrammaticalGenre[] => {
    return GrammaticalGenreRepository.ReadAll();
});

ipcMain.handle("txnmAPI:repositories:grammaticalGenre:readAllByEntry", (event, rawEntry: Entry): GrammaticalGenre[] => {
    const entry: Entry = Entry.Hydrate(rawEntry);
    return GrammaticalGenreRepository.ReadAllByEntry(entry);
});

ipcMain.handle("txnmAPI:repositories:grammaticalGenre:readOne", (event, gramGenreId: number) => {
    return GrammaticalGenreRepository.ReadOne(gramGenreId);
});

ipcMain.handle("txnmAPI:repositories:grammaticalGenre:create", (event, rawGramGenre: GrammaticalGenre) => {
    const gramGenre: GrammaticalGenre = GrammaticalGenre.Hydrate(rawGramGenre)
    return GrammaticalGenreRepository.Create(gramGenre);
});

ipcMain.handle("txnmAPI:repositories:grammaticalGenre:update", (event, rawGramGenre: GrammaticalGenre) => {
    const gramGenre: GrammaticalGenre = GrammaticalGenre.Hydrate(rawGramGenre)
    return GrammaticalGenreRepository.Update(gramGenre);
});

ipcMain.handle("txnmAPI:repositories:grammaticalGenre:delete", (event, rawGramGenre: GrammaticalGenre) => {
    const gramGenre: GrammaticalGenre = GrammaticalGenre.Hydrate(rawGramGenre)
    return GrammaticalGenreRepository.Delete(gramGenre);
});

ipcMain.handle("txnmAPI:repositories:language:readAll", (): Language[] => {
   return LanguageRepository.ReadAll();
});

ipcMain.handle("txnmAPI:repositories:language:readOne", (event, languageId: number) => {
    return LanguageRepository.ReadOne(languageId);
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