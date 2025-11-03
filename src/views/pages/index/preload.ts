import {contextBridge, ipcRenderer} from "electron";
import {Language} from "../../../database/models/Language";
import {TaxonominaSettings} from "../../../interfaces/I_TaxonominaSettings";
import {Dictionary} from "../../../database/models/Dictionary";
import {GrammaticalCategory} from "../../../database/models/GrammaticalCategory";
import {GrammaticalGenre} from "../../../database/models/GrammaticalGenre";
import {Definition} from "../../../database/models/Definition";
import {Entry} from "../../../database/models/Entry";
import {DefinitionRepository} from "../../../database/repositories/DefinitionRepository";

contextBridge.exposeInMainWorld("txnmAPI", {
    LoadTemplateAsString: async (templatePath: string) => ipcRenderer.invoke("txnmAPI:loadTemplateAsString", templatePath),
    settings: {
        Expose: () => ipcRenderer.invoke("txnmAPI:settings:expose"),
        Save: () => ipcRenderer.invoke("txnmAPI:settings:save"),
        Load: () => ipcRenderer.invoke("txnmAPI:settings:load"),
        Update: (key: keyof TaxonominaSettings, value: any): Promise<any> => ipcRenderer.invoke("txnmAPI:settings:update", key, value),
    },
    repositories: {
        definition: {
            ReadAll: (): Promise<Definition[]> => ipcRenderer.invoke("txnmAPI:repositories:definition:readAll"),
            ReadAllByEntry: (rawEntry: Entry): Promise<Definition[]> => ipcRenderer.invoke("txnmAPI:repositories:definition:readAllByEntry", rawEntry),
            ReadOne: (definitionId: number) => ipcRenderer.invoke("txnmAPI:repositories:definition:readOne", definitionId),
            BindToTranslation: (rawDefinition: DefinitionRepository, rawTranslation: Entry) => ipcRenderer.invoke("txnmAPI:repositories:definition:bindToTranslation", rawDefinition, rawTranslation),
            UnbindFromTranslation: (rawDefinition: DefinitionRepository, rawTranslation: Entry) => ipcRenderer.invoke("txnmAPI:repositories:definition:unbindFromTranslation", rawDefinition, rawTranslation),
            Create: (rawDefinition: Definition): Promise<[boolean, Definition | undefined]> => ipcRenderer.invoke("txnmAPI:repositories:definition:create", rawDefinition),
            Update: (rawDefinition: Definition): Promise<[boolean, Definition | undefined]> => ipcRenderer.invoke("txnmAPI:repositories:definition:update", rawDefinition),
            Delete: (rawDefinition: Definition): Promise<boolean> => ipcRenderer.invoke("txnmAPI:repositories:definition:delete", rawDefinition),
        },
        dictionary: {
            ReadAll: (): Promise<Dictionary[]> => ipcRenderer.invoke("txnmAPI:repositories:dictionary:readAll"),
            ReadAllButOne: (rawDictionary: Dictionary): Promise<Dictionary[]> => ipcRenderer.invoke("txnmAPI:repositories:dictionary:readAllButOne", rawDictionary),
            ReadOne: (dictionaryId: number) => ipcRenderer.invoke("txnmAPI:repositories:dictionary:readOne", dictionaryId),
            Create: (rawDictionary: Dictionary): Promise<boolean> => ipcRenderer.invoke("txnmAPI:repositories:dictionary:create", rawDictionary),
            Update: (rawDictionary: Dictionary): Promise<boolean> => ipcRenderer.invoke("txnmAPI:repositories:dictionary:update", rawDictionary),
            Delete: (rawDictionary: Dictionary): Promise<boolean> => ipcRenderer.invoke("txnmAPI:repositories:dictionary:delete", rawDictionary),
        },
        entry: {
            ReadAll: (): Promise<Entry[]> => ipcRenderer.invoke("txnmAPI:repositories:entry:readAll"),
            ReadAllByGlobalTranslation: (rawEntry: Entry): Promise<Entry[]> => ipcRenderer.invoke("txnmAPI:repositories:entry:readAllByGlobalTranslation", rawEntry),
            ReadAllByLocalTranslation: (rawDefinition: Definition): Promise<Entry[]> => ipcRenderer.invoke("txnmAPI:repositories:entry:readAllByLocalTranslation", rawDefinition),
            ReadOne: (entryId: number) => ipcRenderer.invoke("txnmAPI:repositories:entry:readOne", entryId),
            BindToGrammaticalCategory: (rawEntry: Entry, rawCategory: GrammaticalCategory) => ipcRenderer.invoke("txnmAPI:repositories:entry:bindToGrammaticalCategory", rawEntry, rawCategory),
            UnbindFromGrammaticalCategory: (rawEntry: Entry, rawCategory: GrammaticalCategory) => ipcRenderer.invoke("txnmAPI:repositories:entry:unbindFromGrammaticalCategory", rawEntry, rawCategory),
            BindToGrammaticalGenre: (rawEntry: Entry, rawGenre: GrammaticalGenre) => ipcRenderer.invoke("txnmAPI:repositories:entry:bindToGrammaticalGenre", rawEntry, rawGenre),
            UnbindFromGrammaticalGenre: (rawEntry: Entry, rawGenre: GrammaticalGenre) => ipcRenderer.invoke("txnmAPI:repositories:entry:unbindFromGrammaticalGenre", rawEntry, rawGenre),
            BindToTranslation: (rawEntry: Entry, rawTranslation: Entry) => ipcRenderer.invoke("txnmAPI:repositories:entry:bindToTranslation", rawEntry, rawTranslation),
            UnbindFromTranslation: (rawEntry: Entry, rawTranslation: Entry) => ipcRenderer.invoke("txnmAPI:repositories:entry:unbindFromTranslation", rawEntry, rawTranslation),
            Create: (rawEntry: Entry): Promise<[boolean, Entry | undefined]> => ipcRenderer.invoke("txnmAPI:repositories:entry:create", rawEntry),
            Update: (rawEntry: Entry): Promise<[boolean, Entry | undefined]> => ipcRenderer.invoke("txnmAPI:repositories:entry:update", rawEntry),
            Delete: (rawEntry: Entry): Promise<boolean> => ipcRenderer.invoke("txnmAPI:repositories:entry:delete", rawEntry),
        },
        grammaticalCategory: {
            ReadAll: (): Promise<GrammaticalCategory[]> => ipcRenderer.invoke("txnmAPI:repositories:grammaticalCategory:readAll"),
            ReadAllByEntry: (rawEntry: Entry): Promise<GrammaticalCategory[]> => ipcRenderer.invoke("txnmAPI:repositories:grammaticalCategory:readAllByEntry", rawEntry),
            ReadOne: (gramCatId: number) => ipcRenderer.invoke("txnmAPI:repositories:grammaticalCategory:readOne", gramCatId),
            Create: (rawGramCat: GrammaticalCategory): Promise<[boolean, GrammaticalCategory | undefined]> => ipcRenderer.invoke("txnmAPI:repositories:grammaticalCategory:create", rawGramCat),
            Update: (rawGramCat: GrammaticalCategory): Promise<[boolean, GrammaticalCategory | undefined]> => ipcRenderer.invoke("txnmAPI:repositories:grammaticalCategory:update", rawGramCat),
            Delete: (rawGramCat: GrammaticalCategory): Promise<boolean> => ipcRenderer.invoke("txnmAPI:repositories:grammaticalCategory:delete", rawGramCat),
        },
        grammaticalGenre: {
            ReadAll: (): Promise<GrammaticalGenre[]> => ipcRenderer.invoke("txnmAPI:repositories:grammaticalGenre:readAll"),
            ReadAllByEntry: (rawEntry: Entry): Promise<GrammaticalGenre[]> => ipcRenderer.invoke("txnmAPI:repositories:grammaticalGenre:readAllByEntry", rawEntry),
            ReadOne: (gramGenreId: number) => ipcRenderer.invoke("txnmAPI:repositories:grammaticalGenre:readOne", gramGenreId),
            Create: (rawGramGenre: GrammaticalGenre): Promise<[boolean, GrammaticalGenre | undefined]> => ipcRenderer.invoke("txnmAPI:repositories:grammaticalGenre:create", rawGramGenre),
            Update: (rawGramGenre: GrammaticalGenre): Promise<[boolean, GrammaticalGenre | undefined]> => ipcRenderer.invoke("txnmAPI:repositories:grammaticalGenre:update", rawGramGenre),
            Delete: (rawGramGenre: GrammaticalGenre): Promise<boolean> => ipcRenderer.invoke("txnmAPI:repositories:grammaticalGenre:delete", rawGramGenre),
        },
        language: {
            ReadAll: (): Promise<Language[]> => ipcRenderer.invoke("txnmAPI:repositories:language:readAll"),
            ReadOne: (languageId: number) => ipcRenderer.invoke("txnmAPI:repositories:language:readOne", languageId),
            Create: (rawLanguage: Language): Promise<[boolean, GrammaticalGenre | undefined]> => ipcRenderer.invoke("txnmAPI:repositories:language:create", rawLanguage),
            Update: (rawLanguage: Language): Promise<[boolean, GrammaticalGenre | undefined]> => ipcRenderer.invoke("txnmAPI:repositories:language:update", rawLanguage),
            Delete: (rawLanguage: Language): Promise<boolean> => ipcRenderer.invoke("txnmAPI:repositories:language:delete", rawLanguage)
        }
    },
})
