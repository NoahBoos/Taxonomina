import {contextBridge, ipcRenderer} from "electron";
import {Language} from "../../../database/models/Language";

contextBridge.exposeInMainWorld("txnmAPI", {
    LoadTemplate: async (path: string) => ipcRenderer.invoke("txnmAPI:loadTemplate", path),
    repositories: {
        dictionary: {
            Create: (data: { name: string; description: string }): Promise<boolean> => ipcRenderer.invoke("txnmAPI:repositories:dictionary:create", data),
        },
        language: {
            ReadAll: (): Promise<Language[]> => ipcRenderer.invoke("txnmAPI:repositories:language:readAll"),
            Create: (data: { iso_639_1: string, iso_639_3: string, is_conlang: boolean, name_native: string, name_local: string, direction: string }): Promise<boolean> => ipcRenderer.invoke("txnmAPI:repositories:language:create", data),
            Update: (rawLanguage: Language): Promise<boolean> => ipcRenderer.invoke("txnmAPI:repositories:language:update", rawLanguage),
        }
    },
})

console.log("[Preload] - Loaded");
