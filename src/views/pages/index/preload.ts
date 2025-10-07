import {contextBridge, ipcRenderer} from "electron";

contextBridge.exposeInMainWorld("txnmAPI", {
    LoadTemplate: async (path: string) => ipcRenderer.invoke("txnmAPI:loadTemplate", path),
    repositories: {
        dictionary: {
            Create: (data: { name: string; description: string }): Promise<boolean> => ipcRenderer.invoke("txnmAPI:repositories:dictionary:create", data),
        },
        language: {
            Create: (data: { iso_639_1: string, iso_639_3: string, is_conlang: boolean, name_native: string, name_local: string, direction: string }): Promise<boolean> => ipcRenderer.invoke("txnmAPI:repositories:language:create", data),
        }
    },
})

console.log("[Preload] - Loaded");
