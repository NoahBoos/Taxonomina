import {Language} from "./database/models/Language";
import {TaxonominaSettings} from "./utils/main/SettingManager";

export {};

declare global {
    interface Window {
        txnmAPI: {
            LoadTemplateAsString: (templatePath: string) => Promise<string | undefined>,
            settings: {
                Update: (key: keyof TaxonominaSettings, value: any) => Promise<void>,
            }
            repositories: {
                dictionary: {
                    Create: (data: { name: string; description: string }) => Promise<boolean>
                },
                language: {
                    ReadAll: () => Promise<Language[]>,
                    Create: (rawLanguage: Language) => Promise<boolean>,
                    Update: (rawLanguage: Language) => Promise<boolean>,
                    Delete: (rawLanguage: Language) => Promise<boolean>
                }
            }
        }
    }
}