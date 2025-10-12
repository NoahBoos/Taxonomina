import {readFile, writeFile} from "node:fs/promises";
import {app} from "electron";
import { join } from "node:path";
import {settings} from "../../main";
import {TaxonominaSettings} from "../../interfaces/I_TaxonominaSettings";

export class SettingManager {
    private static DEFAULT_SETTINGS: TaxonominaSettings = {
        isDatabaseInitialized: false,
        currentDictionary: 1
    }

    public static async SaveSetting(settings: TaxonominaSettings): Promise<void> {
        try {
            await writeFile(join(app.getPath("userData"), "settings.json"), JSON.stringify(settings, null, 2), "utf8");
            return;
        } catch (error) {
            console.error("An error occurred while saving settings :\n", error);
            return;
        }
    }

    public static async LoadSettings(): Promise<TaxonominaSettings> {
        try {
            const stringToParse: string = await readFile(join(app.getPath("userData"), "settings.json"), "utf8");
            const settings: TaxonominaSettings = JSON.parse(stringToParse);
            console.log("Settings successfully loaded :\n", settings);
            return settings;
        } catch (error) {
            console.error("An error occurred while loading settings :\n", error);
            await SettingManager.SaveSetting(SettingManager.DEFAULT_SETTINGS);
            return SettingManager.DEFAULT_SETTINGS;
        }
    }

    public static async UpdateSetting<K extends keyof TaxonominaSettings>(key: K, value: TaxonominaSettings[K]) {
        settings[key] = value;
        await SettingManager.SaveSetting(settings);
    }
}