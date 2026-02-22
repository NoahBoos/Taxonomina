import {readFile, writeFile} from "node:fs/promises";
import {app} from "electron";
import { join } from "node:path";
import {settings} from "../main";
import {I_TaxonominaSettings} from "../../shared/interfaces/I_TaxonominaSettings";

export class SettingManager {
    private static DEFAULT_SETTINGS: I_TaxonominaSettings = {
        isDatabaseInitialized: false,
        currentDictionary: 1,
        selectedTheme: "default",
        themeVariant: "light",
        fontSize: "base",
        elementsPerPage: 25,
        scrollbarVisibility: true,
        helpButtonVisibility: true
    }

    public static async SaveSetting(settings: I_TaxonominaSettings): Promise<void> {
        try {
            await writeFile(join(app.getPath("userData"), "settings.json"), JSON.stringify(settings, null, 2), "utf8");
            return;
        } catch (error) {
            console.error("An error occurred while saving settings :\n", error);
            return;
        }
    }

    public static async LoadSettings(): Promise<I_TaxonominaSettings> {
        try {
            const stringToParse: string = await readFile(join(app.getPath("userData"), "settings.json"), "utf8");
            const settings: I_TaxonominaSettings = JSON.parse(stringToParse);
            return settings;
        } catch (error) {
            console.error("An error occurred while loading settings :\n", error);
            await SettingManager.SaveSetting(SettingManager.DEFAULT_SETTINGS);
            return SettingManager.DEFAULT_SETTINGS;
        }
    }

    public static async UpdateSetting<K extends keyof I_TaxonominaSettings>(key: K, value: I_TaxonominaSettings[K]) {
        settings[key] = value;
        await SettingManager.SaveSetting(settings);
    }
}