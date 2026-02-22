import {ipcMain} from "electron";
import {SettingManager} from "../utils/SettingManager";
import {I_TaxonominaSettings} from "../../shared/interfaces/I_TaxonominaSettings";
import {settings} from "../main";

export function registerSettingsIPCHandlers() {
    ipcMain.handle("txnmAPI:settings:expose", () => {
        return settings;
    });

    ipcMain.handle("txnmAPI:settings:load", async () => {
        return await SettingManager.LoadSettings();
    });

    ipcMain.handle("txnmAPI:settings:update", async (event, key: keyof I_TaxonominaSettings, value: any) => {
        return await SettingManager.UpdateSetting(key, value);
    });
}