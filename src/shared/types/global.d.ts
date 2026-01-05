import {Language} from "../models/Language";
import {Dictionary} from "../models/Dictionary";
import {TaxonominaSettings} from "../interfaces/TaxonominaSettings";
import {GrammaticalClass} from "../models/GrammaticalClass";
import {GrammaticalGenre} from "../models/GrammaticalGenre";
import {Definition} from "../models/Definition";
import {Entry} from "../models/Entry";
import {ipcRenderer} from "electron";

export {};

declare global {
    interface Window {
        txnmAPI: {
            LoadTemplateAsString: (templatePath: string) => Promise<string | undefined>,
            database: {
                BeginTransaction: () => Promise<any>,
                CommitTransaction: () => Promise<any>,
                RollbackTransaction: () => Promise<any>
            },
            settings: {
                Expose: () => Promise<TaxonominaSettings>,
                Save: () => Promise<void>,
                Load: () => Promise<TaxonominaSettings>,
                Update: (key: keyof TaxonominaSettings, value: any) => Promise<void>,
            }
            repositories: {
                definition: {
                    ReadAll: () => Promise<Definition[]>,
                    ReadAllByEntry: (rawEntry: Entry) => Promise<Definition[]>,
                    ReadOne: (definition) => Promise<Definition>,
                    BindToTranslation: (rawDefinition: Definition, rawTranslation: Entry) => Promise<boolean>,
                    UnbindFromTranslation: (rawDefinition: Definition, rawTranslation: Entry) => Promise<boolean>,
                    Create: (rawDefinition: Definition) => Promise<[boolean, Definition | undefined]>,
                    Update: (rawDefinition: Definition) => Promise<[boolean, Definition | undefined]>,
                    Delete: (rawDefinition: Definition) => Promise<boolean>,
                },
                dictionary: {
                    ReadAll: () => Promise<Dictionary[]>,
                    ReadAllButOne: (rawDictionary) => Promise<Dictionary[]>,
                    ReadOne: (dictionaryId) => Promise<Dictionary>,
                    Create: (rawDictionary: Dictionary) => Promise<[boolean, Entry | undefined]>,
                    Update: (rawDictionary: Dictionary) => Promise<[boolean, Entry | undefined]>,
                    Delete: (rawDictionary: Dictionary) => Promise<boolean>,
                },
                entry: {
                    ReadAll: (dictionary_id: number) => Promise<Entry[]>,
                    ReadAllByGlobalTranslation: (rawEntry: Entry) => Promise<Entry[]>,
                    ReadAllByLocalTranslation: (rawDefinition: Definition) => Promise<Entry[]>,
                    ReadOne: (entry) => Promise<Entry>,
                    Create: (rawEntry: Entry) => Promise<[boolean, Entry | undefined]>,
                    BindToGrammaticalClass: (rawEntry: Entry, rawClass: GrammaticalClass) => Promise<boolean>,
                    UnbindFromGrammaticalClass: (rawEntry: Entry, rawClass: GrammaticalClass) => Promise<boolean>,
                    BindToGrammaticalGenre: (rawEntry: Entry, rawGenre: GrammaticalGenre) => Promise<boolean>,
                    UnbindFromGrammaticalGenre: (rawEntry: Entry, rawGenre: GrammaticalGenre) => Promise<boolean>,
                    BindToTranslation: (rawEntry: Entry, rawTranslation: Entry) => Promise<boolean>,
                    UnbindFromTranslation: (rawEntry: Entry, rawTranslation: Entry) => Promise<boolean>,
                    Update: (rawEntry: Entry) => Promise<[boolean, Entry | undefined]>,
                    Delete: (rawEntry: Entry) => Promise<boolean>,
                },
                grammaticalClass: {
                    ReadAll: (dictionary_id: number) => Promise<GrammaticalClass[]>,
                    ReadAllByEntry: (rawEntry: Entry) => Promise<GrammaticalClass[]>,
                    ReadOne: (grammaticalCategoryId) => Promise<GrammaticalClass>,
                    Create: (rawGramCat: GrammaticalClass) => Promise<[boolean, GrammaticalClass | undefined]>,
                    Update: (rawGramCat: GrammaticalClass) => Promise<[boolean, GrammaticalClass | undefined]>,
                    Delete: (rawGramCat: GrammaticalClass) => Promise<boolean>,
                },
                grammaticalGenre: {
                    ReadAll: (dictionary_id: number) => Promise<GrammaticalGenre[]>,
                    ReadAllByEntry: (rawEntry: Entry) => Promise<GrammaticalGenre[]>,
                    ReadOne: (gramGenreId) => Promise<GrammaticalGenre>,
                    Create: (rawGramGenre: GrammaticalGenre) => Promise<[boolean, GrammaticalGenre | undefined]>,
                    Update: (rawGramGenre: GrammaticalGenre) => Promise<[boolean, GrammaticalGenre | undefined]>,
                    Delete: (rawGramGenre: GrammaticalGenre) => Promise<boolean>,
                }
                language: {
                    ReadAll: (dictionary_id: number) => Promise<Language[]>,
                    ReadOne: (languageId: number) => Promise<Language>,
                    Create: (rawLanguage: Language) => Promise<[boolean, GrammaticalGenre | undefined]>,
                    Update: (rawLanguage: Language) => Promise<[boolean, GrammaticalGenre | undefined]>,
                    Delete: (rawLanguage: Language) => Promise<boolean>
                }
            }
        }
    }
}