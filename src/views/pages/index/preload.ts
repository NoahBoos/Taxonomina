import {contextBridge, ipcRenderer} from "electron";
import {Language} from "../../../database/models/Language";
import {TaxonominaSettings} from "../../../interfaces/I_TaxonominaSettings";
import {Dictionary} from "../../../database/models/Dictionary";
import {GrammaticalCategory} from "../../../database/models/GrammaticalCategory";

contextBridge.exposeInMainWorld("txnmAPI", {
    LoadTemplateAsString: async (templatePath: string) => ipcRenderer.invoke("txnmAPI:loadTemplateAsString", templatePath),
    settings: {
        Expose: () => ipcRenderer.invoke("txnmAPI:settings:expose"),
        Save: () => ipcRenderer.invoke("txnmAPI:settings:save"),
        Load: () => ipcRenderer.invoke("txnmAPI:settings:load"),
        Update: (key: keyof TaxonominaSettings, value: any): Promise<any> => ipcRenderer.invoke("txnmAPI:settings:update", key, value),
    },
    repositories: {
        dictionary: {
            ReadAll: (): Promise<Dictionary[]> => ipcRenderer.invoke("txnmAPI:repositories:dictionary:readAll"),
            ReadAllButOne: (rawDictionary: Dictionary): Promise<Dictionary[]> => ipcRenderer.invoke("txnmAPI:repositories:dictionary:readAllButOne", rawDictionary),
            ReadOne: (dictionaryId: number) => ipcRenderer.invoke("txnmAPI:repositories:dictionary:readOne", dictionaryId),
            Create: (rawDictionary: Dictionary): Promise<boolean> => ipcRenderer.invoke("txnmAPI:repositories:dictionary:create", rawDictionary),
            Update: (rawDictionary: Dictionary): Promise<boolean> => ipcRenderer.invoke("txnmAPI:repositories:dictionary:update", rawDictionary),
            Delete: (rawDictionary: Dictionary): Promise<boolean> => ipcRenderer.invoke("txnmAPI:repositories:dictionary:delete", rawDictionary),
        },
        grammaticalCategory: {
            ReadAll: (): Promise<GrammaticalCategory[]> => ipcRenderer.invoke("txnmAPI:repositories:grammaticalCategory:readAll"),
            ReadOne: (gramCatId: number) => ipcRenderer.invoke("txnmAPI:repositories:grammaticalCategory:readOne", gramCatId),
            Create: (rawGramCat: GrammaticalCategory): Promise<boolean> => ipcRenderer.invoke("txnmAPI:repositories:grammaticalCategory:create", rawGramCat),
            Update: (rawGramCat: GrammaticalCategory): Promise<boolean> => ipcRenderer.invoke("txnmAPI:repositories:grammaticalCategory:update", rawGramCat),
            Delete: (rawGramCat: GrammaticalCategory): Promise<boolean> => ipcRenderer.invoke("txnmAPI:repositories:grammaticalCategory:delete", rawGramCat),
        },
        language: {
            ReadAll: (): Promise<Language[]> => ipcRenderer.invoke("txnmAPI:repositories:language:readAll"),
            Create: (rawLanguage: Language): Promise<boolean> => ipcRenderer.invoke("txnmAPI:repositories:language:create", rawLanguage),
            Update: (rawLanguage: Language): Promise<boolean> => ipcRenderer.invoke("txnmAPI:repositories:language:update", rawLanguage),
            Delete: (rawLanguage: Language): Promise<boolean> => ipcRenderer.invoke("txnmAPI:repositories:language:delete", rawLanguage)
        }
    },
})

console.log("[Preload] - Loaded");
