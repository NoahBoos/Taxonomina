import {Language} from "./database/models/Language";
import {Dictionary} from "./database/models/Dictionary";
import {TaxonominaSettings} from "./interfaces/I_TaxonominaSettings";
import {GrammaticalCategory} from "./database/models/GrammaticalCategory";
import {GrammaticalGenre} from "./database/models/GrammaticalGenre";
import {Definition} from "./database/models/Definition";
import {Entry} from "./database/models/Entry";

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
                definition: {
                    ReadAll: () => Promise<Definition[]>,
                    ReadOne: (definition) => Promise<Definition>,
                    Create: (rawDefinition: Definition) => Promise<[boolean, Definition | undefined]>,
                    Update: (rawDefinition: Definition) => Promise<[boolean, Definition | undefined]>,
                    Delete: (rawDefinition: Definition) => Promise<boolean>,
                },
                dictionary: {
                    ReadAll: () => Promise<Dictionary[]>,
                    ReadAllButOne: (rawDictionary) => Promise<Dictionary[]>,
                    ReadOne: (dictionaryId) => Promise<Dictionary>,
                    Create: (rawDictionary: Dictionary) => Promise<boolean>
                    Update: (rawDictionary: Dictionary) => Promise<boolean>,
                    Delete: (rawDictionary: Dictionary) => Promise<boolean>,
                },
                entry: {
                    ReadAll: () => Promise<Entry[]>,
                    ReadOne: (entry) => Promise<Entry>,
                    Create: (rawEntry: Entry) => Promise<[boolean, Entry | undefined]>,
                    Update: (rawEntry: Entry) => Promise<[boolean, Entry | undefined]>,
                    Delete: (rawEntry: Entry) => Promise<boolean>,
                },
                grammaticalCategory: {
                    ReadAll: () => Promise<GrammaticalCategory[]>,
                    ReadAllByEntry: (rawEntry: Entry) => Promise<GrammaticalCategory[]>,
                    ReadOne: (grammaticalCategoryId) => Promise<GrammaticalCategory>,
                    Create: (rawGramCat: GrammaticalCategory) => Promise<[boolean, GrammaticalCategory | undefined]>,
                    Update: (rawGramCat: GrammaticalCategory) => Promise<[boolean, GrammaticalCategory | undefined]>,
                    Delete: (rawGramCat: GrammaticalCategory) => Promise<boolean>,
                },
                grammaticalGenre: {
                    ReadAll: () => Promise<GrammaticalGenre[]>,
                    ReadAllByEntry: (rawEntry: Entry) => Promise<GrammaticalGenre[]>,
                    ReadOne: (gramGenreId) => Promise<GrammaticalGenre>,
                    Create: (rawGramGenre: GrammaticalGenre) => Promise<[boolean, GrammaticalGenre | undefined]>,
                    Update: (rawGramGenre: GrammaticalGenre) => Promise<[boolean, GrammaticalGenre | undefined]>,
                    Delete: (rawGramGenre: GrammaticalGenre) => Promise<boolean>,
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