import {I_Language} from "../interfaces/I_Language";
import {I_Dictionary} from "../interfaces/I_Dictionary";
import {I_TaxonominaSettings} from "../interfaces/I_TaxonominaSettings";
import {I_GrammaticalClass} from "../interfaces/I_GrammaticalClass";
import {I_GrammaticalGenre} from "../interfaces/I_GrammaticalGenre";
import {I_Definition} from "../interfaces/I_Definition";
import {I_Entry} from "../interfaces/I_Entry";
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
                Expose: () => Promise<I_TaxonominaSettings>,
                Save: () => Promise<void>,
                Load: () => Promise<I_TaxonominaSettings>,
                Update: (key: keyof I_TaxonominaSettings, value: any) => Promise<void>,
            }
            repositories: {
                definition: {
                    ReadAll: () => Promise<I_Definition[]>,
                    ReadAllByEntry: (rawEntry: Entry) => Promise<I_Definition[]>,
                    ReadOne: (definitionId: number) => Promise<I_Definition>,
                    BindToTranslation: (rawDefinition: I_Definition, rawTranslation: Entry) => Promise<boolean>,
                    UnbindFromTranslation: (rawDefinition: I_Definition, rawTranslation: Entry) => Promise<boolean>,
                    Create: (rawDefinition: I_Definition) => Promise<[boolean, I_Definition | undefined]>,
                    Update: (rawDefinition: I_Definition) => Promise<[boolean, I_Definition | undefined]>,
                    Delete: (rawDefinition: I_Definition) => Promise<boolean>,
                },
                dictionary: {
                    ReadAll: () => Promise<I_Dictionary[]>,
                    ReadAllButOne: (rawDictionary) => Promise<I_Dictionary[]>,
                    ReadOne: (dictionaryId) => Promise<I_Dictionary>,
                    Create: (rawDictionary: I_Dictionary) => Promise<[boolean, I_Dictionary | undefined]>,
                    Update: (rawDictionary: I_Dictionary) => Promise<[boolean, I_Dictionary | undefined]>,
                    Delete: (rawDictionary: I_Dictionary) => Promise<boolean>,
                },
                entry: {
                    ReadAll: (dictionary_id: number) => Promise<I_Entry[]>,
                    ReadAllByGlobalTranslation: (rawEntry: I_Entry) => Promise<I_Entry[]>,
                    ReadAllByLocalTranslation: (rawDefinition: I_Definition) => Promise<I_Entry[]>,
                    ReadOne: (entry) => Promise<I_Entry>,
                    Create: (rawEntry: I_Entry) => Promise<[boolean, I_Entry | undefined]>,
                    BindToGrammaticalClass: (rawEntry: I_Entry, rawClass: I_GrammaticalClass) => Promise<boolean>,
                    UnbindFromGrammaticalClass: (rawEntry: I_Entry, rawClass: I_GrammaticalClass) => Promise<boolean>,
                    BindToGrammaticalGenre: (rawEntry: I_Entry, rawGenre: GrammaticalGenre) => Promise<boolean>,
                    UnbindFromGrammaticalGenre: (rawEntry: I_Entry, rawGenre: GrammaticalGenre) => Promise<boolean>,
                    BindToTranslation: (rawEntry: I_Entry, rawTranslation: I_Entry) => Promise<boolean>,
                    UnbindFromTranslation: (rawEntry: I_Entry, rawTranslation: I_Entry) => Promise<boolean>,
                    Update: (rawEntry: I_Entry) => Promise<[boolean, I_Entry | undefined]>,
                    Delete: (rawEntry: I_Entry) => Promise<boolean>,
                },
                grammaticalClass: {
                    ReadAll: (dictionary_id: number) => Promise<I_GrammaticalClass[]>,
                    ReadAllByEntry: (rawEntry: I_Entry) => Promise<I_GrammaticalClass[]>,
                    ReadOne: (grammaticalCategoryId) => Promise<I_GrammaticalClass>,
                    Create: (rawGramCat: I_GrammaticalClass) => Promise<[boolean, I_GrammaticalClass | undefined]>,
                    Update: (rawGramCat: I_GrammaticalClass) => Promise<[boolean, I_GrammaticalClass | undefined]>,
                    Delete: (rawGramCat: I_GrammaticalClass) => Promise<boolean>,
                },
                grammaticalGenre: {
                    ReadAll: (dictionary_id: number) => Promise<I_GrammaticalGenre[]>,
                    ReadAllByEntry: (rawEntry: I_Entry) => Promise<I_GrammaticalGenre[]>,
                    ReadOne: (gramGenreId) => Promise<I_GrammaticalGenre>,
                    Create: (rawGramGenre: I_GrammaticalGenre) => Promise<[boolean, I_GrammaticalGenre | undefined]>,
                    Update: (rawGramGenre: I_GrammaticalGenre) => Promise<[boolean, I_GrammaticalGenre | undefined]>,
                    Delete: (rawGramGenre: I_GrammaticalGenre) => Promise<boolean>,
                }
                language: {
                    ReadAll: (dictionary_id: number) => Promise<I_Language[]>,
                    ReadOne: (languageId: number) => Promise<I_Language>,
                    Create: (rawLanguage: I_Language) => Promise<[boolean, I_Language | undefined]>,
                    Update: (rawLanguage: I_Language) => Promise<[boolean, I_Language | undefined]>,
                    Delete: (rawLanguage: I_Language) => Promise<boolean>
                }
            }
        }
    }
}