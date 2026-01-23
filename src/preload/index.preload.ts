import {contextBridge, ipcRenderer} from "electron";
import {I_Language} from "../shared/interfaces/I_Language";
import {I_TaxonominaSettings} from "../shared/interfaces/I_TaxonominaSettings";
import {I_Dictionary} from "../shared/interfaces/I_Dictionary";
import {I_GrammaticalClass} from "../shared/interfaces/I_GrammaticalClass";
import {I_GrammaticalGenre} from "../shared/interfaces/I_GrammaticalGenre";
import {I_Definition} from "../shared/interfaces/I_Definition";
import {I_Entry} from "../shared/interfaces/I_Entry";

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
            readAll: (): Promise<I_Definition[]> => ipcRenderer.invoke("txnmAPI:repositories:definition:readAll"),
            readAllByEntry: (entry_id: number): Promise<I_Definition[]> => ipcRenderer.invoke("txnmAPI:repositories:definition:readAllByEntry", entry_id),
            readOne: (definition_id: number): Promise<I_Definition> => ipcRenderer.invoke("txnmAPI:repositories:definition:readOne", definition_id),
            create: (definition: I_Definition): Promise<[boolean, I_Definition | undefined]> => ipcRenderer.invoke("txnmAPI:repositories:definition:create", definition),
            update: (definition: I_Definition): Promise<[boolean, I_Definition | undefined]> => ipcRenderer.invoke("txnmAPI:repositories:definition:update", definition),
            delete: (definition_id: number): Promise<boolean> => ipcRenderer.invoke("txnmAPI:repositories:definition:delete", definition_id),
            bindToTranslation: (definition: I_Definition, translation: I_Entry): Promise<boolean> => ipcRenderer.invoke("txnmAPI:repositories:definition:bindToTranslation", definition, translation),
            unbindFromTranslation: (definition: I_Definition, translation: I_Entry): Promise<boolean> => ipcRenderer.invoke("txnmAPI:repositories:definition:unbindFromTranslation", definition, translation),
        },
        dictionary: {
            readAll: (): Promise<I_Dictionary[]> => ipcRenderer.invoke("txnmAPI:repositories:dictionary:readAll"),
            readOne: (dictionary_id: number): Promise<I_Dictionary | undefined> => ipcRenderer.invoke("txnmAPI:repositories:dictionary:readOne", dictionary_id),
            create: (dictionary: I_Dictionary): Promise<[boolean, I_Dictionary | undefined]> => ipcRenderer.invoke("txnmAPI:repositories:dictionary:create", dictionary),
            update: (dictionary: I_Dictionary): Promise<[boolean, I_Dictionary | undefined]> => ipcRenderer.invoke("txnmAPI:repositories:dictionary:update", dictionary),
            delete: (dictionary_id: I_Dictionary): Promise<boolean> => ipcRenderer.invoke("txnmAPI:repositories:dictionary:delete", dictionary_id),
        },
        entry: {
            ReadAll: (dictionary_id: number): Promise<I_Entry[]> => ipcRenderer.invoke("txnmAPI:repositories:entry:readAll", dictionary_id),
            ReadAllByGlobalTranslation: (rawEntry: I_Entry): Promise<I_Entry[]> => ipcRenderer.invoke("txnmAPI:repositories:entry:readAllByGlobalTranslation", rawEntry),
            ReadAllByLocalTranslation: (rawDefinition: I_Definition): Promise<I_Entry[]> => ipcRenderer.invoke("txnmAPI:repositories:entry:readAllByLocalTranslation", rawDefinition),
            ReadOne: (entryId: number) => ipcRenderer.invoke("txnmAPI:repositories:entry:readOne", entryId),
            BindToGrammaticalClass: (rawEntry: I_Entry, rawClass: I_GrammaticalClass) => ipcRenderer.invoke("txnmAPI:repositories:entry:bindToGrammaticalClass", rawEntry, rawClass),
            UnbindFromGrammaticalClass: (rawEntry: I_Entry, rawClass: I_GrammaticalClass) => ipcRenderer.invoke("txnmAPI:repositories:entry:unbindFromGrammaticalClass", rawEntry, rawClass),
            BindToGrammaticalGenre: (rawEntry: I_Entry, rawGenre: I_GrammaticalGenre) => ipcRenderer.invoke("txnmAPI:repositories:entry:bindToGrammaticalGenre", rawEntry, rawGenre),
            UnbindFromGrammaticalGenre: (rawEntry: I_Entry, rawGenre: I_GrammaticalGenre) => ipcRenderer.invoke("txnmAPI:repositories:entry:unbindFromGrammaticalGenre", rawEntry, rawGenre),
            BindToTranslation: (rawEntry: I_Entry, rawTranslation: I_Entry) => ipcRenderer.invoke("txnmAPI:repositories:entry:bindToTranslation", rawEntry, rawTranslation),
            UnbindFromTranslation: (rawEntry: I_Entry, rawTranslation: I_Entry) => ipcRenderer.invoke("txnmAPI:repositories:entry:unbindFromTranslation", rawEntry, rawTranslation),
            Create: (rawEntry: I_Entry): Promise<[boolean, I_Entry | undefined]> => ipcRenderer.invoke("txnmAPI:repositories:entry:create", rawEntry),
            Update: (rawEntry: I_Entry): Promise<[boolean, I_Entry | undefined]> => ipcRenderer.invoke("txnmAPI:repositories:entry:update", rawEntry),
            Delete: (rawEntry: I_Entry): Promise<boolean> => ipcRenderer.invoke("txnmAPI:repositories:entry:delete", rawEntry),
        },
        grammaticalClass: {
            readAll: (dictionary_id: number): Promise<I_GrammaticalClass[]> => ipcRenderer.invoke("txnmAPI:repositories:grammaticalClass:readAll", dictionary_id),
            readAllByEntry: (entry_id: number): Promise<I_GrammaticalClass[]> => ipcRenderer.invoke("txnmAPI:repositories:grammaticalClass:readAllByEntry", entry_id),
            readOne: (grammatical_class_id: number): Promise<I_GrammaticalClass | undefined> => ipcRenderer.invoke("txnmAPI:repositories:grammaticalClass:readOne", grammatical_class_id),
            create: (grammatical_class: I_GrammaticalClass): Promise<[boolean, I_GrammaticalClass | undefined]> => ipcRenderer.invoke("txnmAPI:repositories:grammaticalClass:create", grammatical_class),
            update: (grammatical_class: I_GrammaticalClass): Promise<[boolean, I_GrammaticalClass | undefined]> => ipcRenderer.invoke("txnmAPI:repositories:grammaticalClass:update", grammatical_class),
            delete: (grammatical_class_id: number): Promise<boolean> => ipcRenderer.invoke("txnmAPI:repositories:grammaticalClass:delete", grammatical_class_id),
        },
        grammaticalGenre: {
            readAll: (dictionary_id: number): Promise<I_GrammaticalGenre[]> => ipcRenderer.invoke("txnmAPI:repositories:grammaticalGenre:readAll", dictionary_id),
            readAllByEntry: (entry_id: number): Promise<I_GrammaticalGenre[]> => ipcRenderer.invoke("txnmAPI:repositories:grammaticalGenre:readAllByEntry", entry_id),
            readOne: (grammatical_genre_id: number): Promise<I_GrammaticalGenre | undefined> => ipcRenderer.invoke("txnmAPI:repositories:grammaticalGenre:readOne", grammatical_genre_id),
            create: (grammatical_genre: I_GrammaticalGenre): Promise<[boolean, I_GrammaticalGenre | undefined]> => ipcRenderer.invoke("txnmAPI:repositories:grammaticalGenre:create", grammatical_genre),
            update: (grammatical_genre: I_GrammaticalGenre): Promise<[boolean, I_GrammaticalGenre | undefined]> => ipcRenderer.invoke("txnmAPI:repositories:grammaticalGenre:update", grammatical_genre),
            delete: (grammatical_genre_id: number): Promise<boolean> => ipcRenderer.invoke("txnmAPI:repositories:grammaticalGenre:delete", grammatical_genre_id),
        },
        language: {
            readAll: (dictionary_id: number): Promise<I_Language[]> => ipcRenderer.invoke("txnmAPI:repositories:language:readAll", dictionary_id),
            readOne: (language_id: number): Promise<I_Language[]> => ipcRenderer.invoke("txnmAPI:repositories:language:readOne", language_id),
            create: (language: I_Language): Promise<[boolean, I_Language | undefined]> => ipcRenderer.invoke("txnmAPI:repositories:language:create", language),
            update: (language: I_Language): Promise<[boolean, I_Language | undefined]> => ipcRenderer.invoke("txnmAPI:repositories:language:update", language),
            delete: (language_id: number): Promise<boolean> => ipcRenderer.invoke("txnmAPI:repositories:language:delete", language_id)
        }
    },
})
