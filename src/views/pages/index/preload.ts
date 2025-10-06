import {contextBridge, ipcRenderer} from "electron";

contextBridge.exposeInMainWorld("txnmAPI", {
    LoadTemplate: async (path: string) => ipcRenderer.invoke("txnmAPI:loadTemplate", path),
    repositories: {
        dictionary: {
            Create: (data: { name: string; description: string }): Promise<boolean> => ipcRenderer.invoke("txnmAPI:repositories:dictionary:create", data),
        }
    },
})

console.log("[Preload] - Loaded");
