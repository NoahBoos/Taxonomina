import * as path from "node:path";

import {app, BrowserWindow} from "electron";
import {Database} from "./database/Database";
import {SettingManager} from "./utils/SettingManager";
import {I_TaxonominaSettings} from "../shared/interfaces/I_TaxonominaSettings";
import {registerAllIPCHandlers} from "./ipc";

export let settings: I_TaxonominaSettings;
async function InitializeSetting() {
    settings = await SettingManager.LoadSettings();
}

const CreateIndexWindow = () => {
    const window = new BrowserWindow({
        width: 1600,
        height: 900,
        frame: true,
        webPreferences: {
            preload: path.join(__dirname, "../../preload/preload/index.preload.js"),
            // devTools: false
        }
    });
    window.setMenuBarVisibility(false);
    InitializeSetting().then(r => {
        Database.InitializeDatabase();
    })
    window.loadFile(path.join(__dirname, "../../renderer/pages/index/index.html"));
}

app.whenReady().then(() => {
    CreateIndexWindow();

    app.on("activate", () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            CreateIndexWindow();
        }
    })
})

registerAllIPCHandlers();