import {Language} from "./database/models/Language";
import {Dictionary} from "./database/models/Dictionary";
import {TaxonominaSettings} from "./interfaces/I_TaxonominaSettings";

export {};

declare global {
    interface Window {
        txnmAPI: {
            LoadTemplateAsString: (templatePath: string) => Promise<string | undefined>,
            settings: {
                Expose: () => Promise<TaxonominaSettings>,
                Save: () => Promise<void>,
                Load: () => Promise<TaxonominaSettings>,
                Update: (key: keyof TaxonominaSettings, value: any) => Promise<void>,
            }
            repositories: {
                dictionary: {
                    ReadOne: (dictionaryId) => Promise<Dictionary>,
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