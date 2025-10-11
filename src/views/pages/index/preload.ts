import {contextBridge, ipcRenderer} from "electron";
import {Language} from "../../../database/models/Language";

contextBridge.exposeInMainWorld("txnmAPI", {
    LoadTemplateAsString: async (templatePath: string) => ipcRenderer.invoke("txnmAPI:loadTemplateAsString", templatePath),
    repositories: {
        dictionary: {
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
