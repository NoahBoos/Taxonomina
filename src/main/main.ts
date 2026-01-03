import * as path from "node:path";

import {app, BrowserWindow, ipcMain} from "electron";
import {Database} from "./database/Database";
import {DictionaryRepository} from "./database/repositories/DictionaryRepository";
import { Dictionary } from "../shared/models/Dictionary";
import {LanguageRepository} from "./database/repositories/LanguageRepository";
import {Language} from "../shared/models/Language";
import {LoadTemplateAsString} from "./utils/TemplateManager";
import {SettingManager} from "./utils/SettingManager";
import {TaxonominaSettings} from "../shared/interfaces/I_TaxonominaSettings";
import {GrammaticalClass} from "../shared/models/GrammaticalClass";
import {GrammaticalClassRepository} from "./database/repositories/GrammaticalClassRepository";
import {GrammaticalGenreRepository} from "./database/repositories/GrammaticalGenreRepository";
import {GrammaticalGenre} from "../shared/models/GrammaticalGenre";
import {Definition} from "../shared/models/Definition";
import {DefinitionRepository} from "./database/repositories/DefinitionRepository";
import {Entry} from "../shared/models/Entry";
import {EntryRepository} from "./database/repositories/EntryRepository";

export let settings: TaxonominaSettings;
async function InitializeSetting() {
    settings = await SettingManager.LoadSettings();
}

const CreateIndexWindow = () => {
    const window = new BrowserWindow({
        width: 1600,
        height: 900,
        frame: true,
        webPreferences: {
            preload: path.join(__dirname, "../../preload/preload/index.preload.js"),
            // devTools: false
        }
    });
    window.setMenuBarVisibility(false);
    InitializeSetting().then(r => {
        Database.InitializeDatabase();
    })
    window.loadFile(path.join(__dirname, "../../renderer/pages/index/index.html"));
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

ipcMain.handle("txnmAPI:database:beginTransaction", () => {
    return Database.BeginTransaction();
});

ipcMain.handle("txnmAPI:database:commitTransaction", () => {
    return Database.CommitTransaction();
});

ipcMain.handle("txnmAPI:database:rollbackTransaction", () => {
    return Database.RollbackTransaction();
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

ipcMain.handle("txnmAPI:repositories:definition:readAllByEntry", (event, rawEntry: Entry) => {
    const entry: Entry = Entry.Hydrate(rawEntry);
    return DefinitionRepository.ReadAllByEntry(entry);
});

ipcMain.handle("txnmAPI:repositories:definition:readOne", (event, definitionId: number) => {
    return DefinitionRepository.ReadOne(definitionId);
});

ipcMain.handle("txnmAPI:repositories:definition:bindToTranslation", (event, rawDefinition: Definition, rawTranslation: Entry) => {
    const definition: Definition = Definition.Hydrate(rawDefinition);
    const translation: Entry = Entry.Hydrate(rawTranslation);
    return DefinitionRepository.BindToTranslation(definition, translation);
})

ipcMain.handle("txnmAPI:repositories:definition:unbindFromTranslation", (event, rawDefinition: Definition, rawTranslation: Entry) => {
    const definition: Definition = Definition.Hydrate(rawDefinition);
    const translation: Entry = Entry.Hydrate(rawTranslation);
    return DefinitionRepository.UnbindFromTranslation(definition, translation);
})

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

ipcMain.handle("txnmAPI:repositories:entry:readAll", (event, dictionary_id: number): Entry[] => {
    return EntryRepository.ReadAll(dictionary_id);
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

ipcMain.handle("txnmAPI:repositories:entry:bindToGrammaticalClass", (event, rawEntry: Entry, rawClass: GrammaticalClass) => {
    const entry: Entry = Entry.Hydrate(rawEntry);
    const grammaticalClass: GrammaticalClass = GrammaticalClass.Hydrate(rawClass);
    return EntryRepository.BindToGrammaticalClass(entry, grammaticalClass);
})

ipcMain.handle("txnmAPI:repositories:entry:unbindFromGrammaticalClass", (event, rawEntry: Entry, rawClass: GrammaticalClass) => {
    const entry: Entry = Entry.Hydrate(rawEntry);
    const grammaticalClass: GrammaticalClass = GrammaticalClass.Hydrate(rawClass);
    return EntryRepository.UnbindFromGrammaticalClass(entry, grammaticalClass);
})

ipcMain.handle("txnmAPI:repositories:entry:bindToGrammaticalGenre", (event, rawEntry: Entry, rawGenre: GrammaticalGenre) => {
    const entry: Entry = Entry.Hydrate(rawEntry);
    const genre: GrammaticalGenre = GrammaticalGenre.Hydrate(rawGenre);
    return EntryRepository.BindToGrammaticalGenre(entry, genre);
})

ipcMain.handle("txnmAPI:repositories:entry:unbindFromGrammaticalGenre", (event, rawEntry: Entry, rawGenre: GrammaticalGenre) => {
    const entry: Entry = Entry.Hydrate(rawEntry);
    const genre: GrammaticalGenre = GrammaticalGenre.Hydrate(rawGenre);
    return EntryRepository.UnbindFromGrammaticalGenre(entry, genre);
})

ipcMain.handle("txnmAPI:repositories:entry:bindToTranslation", (event, rawEntry: Entry, rawTranslation: Entry) => {
    const entry: Entry = Entry.Hydrate(rawEntry);
    const translation: Entry = Entry.Hydrate(rawTranslation);
    return EntryRepository.BindToTranslation(entry, translation);
})

ipcMain.handle("txnmAPI:repositories:entry:unbindFromTranslation", (event, rawEntry: Entry, rawTranslation: Entry) => {
    const entry: Entry = Entry.Hydrate(rawEntry);
    const translation: Entry = Entry.Hydrate(rawTranslation);
    return EntryRepository.UnbindFromTranslation(entry, translation);
})

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

ipcMain.handle("txnmAPI:repositories:grammaticalClass:readAll", (event, dictionary_id: number): GrammaticalClass[] => {
    return GrammaticalClassRepository.ReadAll(dictionary_id);
});

ipcMain.handle("txnmAPI:repositories:grammaticalClass:readAllByEntry", (event, rawEntry: Entry): GrammaticalClass[] => {
    const entry: Entry = Entry.Hydrate(rawEntry);
    return GrammaticalClassRepository.ReadAllByEntry(entry);
});

ipcMain.handle("txnmAPI:repositories:grammaticalClass:readOne", (event, grammaticalClassId: number) => {
    return GrammaticalClassRepository.ReadOne(grammaticalClassId);
});

ipcMain.handle("txnmAPI:repositories:grammaticalClass:create", (event, rawGrammaticalClass: GrammaticalClass) => {
    const gramCat: GrammaticalClass = GrammaticalClass.Hydrate(rawGrammaticalClass)
    return GrammaticalClassRepository.Create(gramCat);
});

ipcMain.handle("txnmAPI:repositories:grammaticalClass:update", (event, rawGrammaticalClass: GrammaticalClass) => {
    const gramCat: GrammaticalClass = GrammaticalClass.Hydrate(rawGrammaticalClass)
    return GrammaticalClassRepository.Update(gramCat);
});

ipcMain.handle("txnmAPI:repositories:grammaticalClass:delete", (event, rawGrammaticalClass: GrammaticalClass) => {
    const gramCat: GrammaticalClass = GrammaticalClass.Hydrate(rawGrammaticalClass)
    return GrammaticalClassRepository.Delete(gramCat);
});

ipcMain.handle("txnmAPI:repositories:grammaticalGenre:readAll", (event, dictionary_id: number): GrammaticalGenre[] => {
    return GrammaticalGenreRepository.ReadAll(dictionary_id);
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

ipcMain.handle("txnmAPI:repositories:language:readAll", (event, dictionary_id: number): Language[] => {
   return LanguageRepository.ReadAll(dictionary_id);
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