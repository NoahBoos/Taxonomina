import {contextBridge, ipcRenderer} from "electron";
import {Language} from "../../../database/models/Language";
import {TaxonominaSettings} from "../../../interfaces/I_TaxonominaSettings";

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
            ReadOne: (dictionaryId: number) => ipcRenderer.invoke("txnmAPI:repositories:dictionary:readOne", dictionaryId),
            Create: (data: { name: string; description: string }): Promise<boolean> => ipcRenderer.invoke("txnmAPI:repositories:dictionary:create", data),
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
