import {contextBridge, ipcRenderer} from "electron";
import {Language} from "../shared/models/Language";
import {I_TaxonominaSettings} from "../shared/interfaces/I_TaxonominaSettings";
import {Dictionary} from "../shared/models/Dictionary";
import {GrammaticalClass} from "../shared/models/GrammaticalClass";
import {GrammaticalGenre} from "../shared/models/GrammaticalGenre";
import {Definition} from "../shared/models/Definition";
import {Entry} from "../shared/models/Entry";

contextBridge.exposeInMainWorld("txnmAPI", {
    LoadTemplateAsString: async (templatePath: string) => ipcRenderer.invoke("txnmAPI:loadTemplateAsString", templatePath),
    database: {
        BeginTransaction: () => ipcRenderer.invoke("txnmAPI:database:beginTransaction"),
        CommitTransaction: () => ipcRenderer.invoke("txnmAPI:database:commitTransaction"),
        RollbackTransaction: () => ipcRenderer.invoke("txnmAPI:database:rollbackTransaction")
    },
    settings: {
        Expose: () => ipcRenderer.invoke("txnmAPI:settings:expose"),
        Save: () => ipcRenderer.invoke("txnmAPI:settings:save"),
        Load: () => ipcRenderer.invoke("txnmAPI:settings:load"),
        Update: (key: keyof I_TaxonominaSettings, value: any): Promise<any> => ipcRenderer.invoke("txnmAPI:settings:update", key, value),
    },
    repositories: {
        definition: {
            ReadAll: (): Promise<Definition[]> => ipcRenderer.invoke("txnmAPI:repositories:definition:readAll"),
            ReadAllByEntry: (rawEntry: Entry): Promise<Definition[]> => ipcRenderer.invoke("txnmAPI:repositories:definition:readAllByEntry", rawEntry),
            ReadOne: (definitionId: number) => ipcRenderer.invoke("txnmAPI:repositories:definition:readOne", definitionId),
            BindToTranslation: (rawDefinition: Definition, rawTranslation: Entry) => ipcRenderer.invoke("txnmAPI:repositories:definition:bindToTranslation", rawDefinition, rawTranslation),
            UnbindFromTranslation: (rawDefinition: Definition, rawTranslation: Entry) => ipcRenderer.invoke("txnmAPI:repositories:definition:unbindFromTranslation", rawDefinition, rawTranslation),
            Create: (rawDefinition: Definition): Promise<[boolean, Definition | undefined]> => ipcRenderer.invoke("txnmAPI:repositories:definition:create", rawDefinition),
            Update: (rawDefinition: Definition): Promise<[boolean, Definition | undefined]> => ipcRenderer.invoke("txnmAPI:repositories:definition:update", rawDefinition),
            Delete: (rawDefinition: Definition): Promise<boolean> => ipcRenderer.invoke("txnmAPI:repositories:definition:delete", rawDefinition),
        },
        dictionary: {
            ReadAll: (): Promise<Dictionary[]> => ipcRenderer.invoke("txnmAPI:repositories:dictionary:readAll"),
            ReadAllButOne: (rawDictionary: Dictionary): Promise<Dictionary[]> => ipcRenderer.invoke("txnmAPI:repositories:dictionary:readAllButOne", rawDictionary),
            ReadOne: (dictionaryId: number) => ipcRenderer.invoke("txnmAPI:repositories:dictionary:readOne", dictionaryId),
            Create: (rawDictionary: Dictionary): Promise<[boolean, Entry | undefined]> => ipcRenderer.invoke("txnmAPI:repositories:dictionary:create", rawDictionary),
            Update: (rawDictionary: Dictionary): Promise<[boolean, Entry | undefined]> => ipcRenderer.invoke("txnmAPI:repositories:dictionary:update", rawDictionary),
            Delete: (rawDictionary: Dictionary): Promise<boolean> => ipcRenderer.invoke("txnmAPI:repositories:dictionary:delete", rawDictionary),
        },
        entry: {
            ReadAll: (dictionary_id: number): Promise<Entry[]> => ipcRenderer.invoke("txnmAPI:repositories:entry:readAll", dictionary_id),
            ReadAllByGlobalTranslation: (rawEntry: Entry): Promise<Entry[]> => ipcRenderer.invoke("txnmAPI:repositories:entry:readAllByGlobalTranslation", rawEntry),
            ReadAllByLocalTranslation: (rawDefinition: Definition): Promise<Entry[]> => ipcRenderer.invoke("txnmAPI:repositories:entry:readAllByLocalTranslation", rawDefinition),
            ReadOne: (entryId: number) => ipcRenderer.invoke("txnmAPI:repositories:entry:readOne", entryId),
            BindToGrammaticalClass: (rawEntry: Entry, rawClass: GrammaticalClass) => ipcRenderer.invoke("txnmAPI:repositories:entry:bindToGrammaticalClass", rawEntry, rawClass),
            UnbindFromGrammaticalClass: (rawEntry: Entry, rawClass: GrammaticalClass) => ipcRenderer.invoke("txnmAPI:repositories:entry:unbindFromGrammaticalClass", rawEntry, rawClass),
            BindToGrammaticalGenre: (rawEntry: Entry, rawGenre: GrammaticalGenre) => ipcRenderer.invoke("txnmAPI:repositories:entry:bindToGrammaticalGenre", rawEntry, rawGenre),
            UnbindFromGrammaticalGenre: (rawEntry: Entry, rawGenre: GrammaticalGenre) => ipcRenderer.invoke("txnmAPI:repositories:entry:unbindFromGrammaticalGenre", rawEntry, rawGenre),
            BindToTranslation: (rawEntry: Entry, rawTranslation: Entry) => ipcRenderer.invoke("txnmAPI:repositories:entry:bindToTranslation", rawEntry, rawTranslation),
            UnbindFromTranslation: (rawEntry: Entry, rawTranslation: Entry) => ipcRenderer.invoke("txnmAPI:repositories:entry:unbindFromTranslation", rawEntry, rawTranslation),
            Create: (rawEntry: Entry): Promise<[boolean, Entry | undefined]> => ipcRenderer.invoke("txnmAPI:repositories:entry:create", rawEntry),
            Update: (rawEntry: Entry): Promise<[boolean, Entry | undefined]> => ipcRenderer.invoke("txnmAPI:repositories:entry:update", rawEntry),
            Delete: (rawEntry: Entry): Promise<boolean> => ipcRenderer.invoke("txnmAPI:repositories:entry:delete", rawEntry),
        },
        grammaticalClass: {
            ReadAll: (dictionary_id: number): Promise<GrammaticalClass[]> => ipcRenderer.invoke("txnmAPI:repositories:grammaticalClass:readAll", dictionary_id),
            ReadAllByEntry: (rawEntry: Entry): Promise<GrammaticalClass[]> => ipcRenderer.invoke("txnmAPI:repositories:grammaticalClass:readAllByEntry", rawEntry),
            ReadOne: (grammaticalClassId: number) => ipcRenderer.invoke("txnmAPI:repositories:grammaticalClass:readOne", grammaticalClassId),
            Create: (rawGrammaticalClass: GrammaticalClass): Promise<[boolean, GrammaticalClass | undefined]> => ipcRenderer.invoke("txnmAPI:repositories:grammaticalClass:create", rawGrammaticalClass),
            Update: (rawGrammaticalClass: GrammaticalClass): Promise<[boolean, GrammaticalClass | undefined]> => ipcRenderer.invoke("txnmAPI:repositories:grammaticalClass:update", rawGrammaticalClass),
            Delete: (rawGrammaticalClass: GrammaticalClass): Promise<boolean> => ipcRenderer.invoke("txnmAPI:repositories:grammaticalClass:delete", rawGrammaticalClass),
        },
        grammaticalGenre: {
            ReadAll: (dictionary_id: number): Promise<GrammaticalGenre[]> => ipcRenderer.invoke("txnmAPI:repositories:grammaticalGenre:readAll", dictionary_id),
            ReadAllByEntry: (rawEntry: Entry): Promise<GrammaticalGenre[]> => ipcRenderer.invoke("txnmAPI:repositories:grammaticalGenre:readAllByEntry", rawEntry),
            ReadOne: (gramGenreId: number) => ipcRenderer.invoke("txnmAPI:repositories:grammaticalGenre:readOne", gramGenreId),
            Create: (rawGramGenre: GrammaticalGenre): Promise<[boolean, GrammaticalGenre | undefined]> => ipcRenderer.invoke("txnmAPI:repositories:grammaticalGenre:create", rawGramGenre),
            Update: (rawGramGenre: GrammaticalGenre): Promise<[boolean, GrammaticalGenre | undefined]> => ipcRenderer.invoke("txnmAPI:repositories:grammaticalGenre:update", rawGramGenre),
            Delete: (rawGramGenre: GrammaticalGenre): Promise<boolean> => ipcRenderer.invoke("txnmAPI:repositories:grammaticalGenre:delete", rawGramGenre),
        },
        language: {
            ReadAll: (dictionary_id: number): Promise<Language[]> => ipcRenderer.invoke("txnmAPI:repositories:language:readAll", dictionary_id),
            ReadOne: (languageId: number) => ipcRenderer.invoke("txnmAPI:repositories:language:readOne", languageId),
            Create: (rawLanguage: Language): Promise<[boolean, GrammaticalGenre | undefined]> => ipcRenderer.invoke("txnmAPI:repositories:language:create", rawLanguage),
            Update: (rawLanguage: Language): Promise<[boolean, GrammaticalGenre | undefined]> => ipcRenderer.invoke("txnmAPI:repositories:language:update", rawLanguage),
            Delete: (rawLanguage: Language): Promise<boolean> => ipcRenderer.invoke("txnmAPI:repositories:language:delete", rawLanguage)
        }
    },
})
