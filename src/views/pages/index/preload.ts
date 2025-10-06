import {contextBridge, ipcRenderer} from "electron";

contextBridge.exposeInMainWorld("txnmAPI", {
    LoadTemplate: async (path: string) => ipcRenderer.invoke("txnmAPI:loadTemplate", path)
})