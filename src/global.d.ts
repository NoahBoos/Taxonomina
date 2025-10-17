import {Language} from "./database/models/Language";
import {Dictionary} from "./database/models/Dictionary";
import {TaxonominaSettings} from "./interfaces/I_TaxonominaSettings";
import {GrammaticalCategory} from "./database/models/GrammaticalCategory";

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
                    ReadAll: () => Promise<Dictionary[]>,
                    ReadAllButOne: (rawDictionary) => Promise<Dictionary[]>,
                    ReadOne: (dictionaryId) => Promise<Dictionary>,
                    Create: (rawDictionary: Dictionary) => Promise<boolean>
                    Update: (rawDictionary: Dictionary) => Promise<boolean>,
                    Delete: (rawDictionary: Dictionary) => Promise<boolean>,
                },
                grammaticalCategory: {
                    ReadAll: () => Promise<GrammaticalCategory[]>,
                    ReadOne: (grammaticalCategoryId) => Promise<GrammaticalCategory>,
                    Create: (rawGrammaticalCategory: GrammaticalCategory) => Promise<boolean>,
                    Update: (rawGrammaticalCategory: GrammaticalCategory) => Promise<boolean>,
                    Delete: (rawGrammaticalCategory: GrammaticalCategory) => Promise<boolean>,
                }
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