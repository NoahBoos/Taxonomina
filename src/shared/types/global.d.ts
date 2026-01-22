import {I_Language} from "../interfaces/I_Language";
import {I_Dictionary} from "../interfaces/I_Dictionary";
import {I_TaxonominaSettings} from "../interfaces/I_TaxonominaSettings";
import {I_GrammaticalClass} from "../interfaces/I_GrammaticalClass";
import {I_GrammaticalGenre} from "../interfaces/I_GrammaticalGenre";
import {I_Definition} from "../interfaces/I_Definition";
import {I_Entry} from "../interfaces/I_Entry";

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
                    readAll: () => Promise<I_Definition[]>,
                    readAllByEntry: (entry_id: number) => Promise<I_Definition[]>,
                    readOne: (definition_id: number) => Promise<I_Definition>,
                    create: (definition: I_Definition) => Promise<[boolean, I_Definition | undefined]>,
                    update: (definition: I_Definition) => Promise<[boolean, I_Definition | undefined]>,
                    delete: (definition_id: number) => Promise<boolean>,
                    bindToTranslation: (definition_id: number, translation_id: number) => Promise<boolean>,
                    unbindFromTranslation: (definition_id: number, translation_id: number) => Promise<boolean>,
                },
                dictionary: {
                    readAll: () => Promise<I_Dictionary[]>,
                    readOne: (dictionary_id) => Promise<I_Dictionary>,
                    create: (dictionary: I_Dictionary) => Promise<[boolean, I_Dictionary | undefined]>,
                    update: (dictionary: I_Dictionary) => Promise<[boolean, I_Dictionary | undefined]>,
                    delete: (dictionary: I_Dictionary) => Promise<boolean>,
                },
                entry: {
                    ReadAll: (dictionary_id: number) => Promise<I_Entry[]>,
                    ReadAllByGlobalTranslation: (rawEntry: I_Entry) => Promise<I_Entry[]>,
                    ReadAllByLocalTranslation: (rawDefinition: I_Definition) => Promise<I_Entry[]>,
                    ReadOne: (entry) => Promise<I_Entry>,
                    Create: (rawEntry: I_Entry) => Promise<[boolean, I_Entry | undefined]>,
                    BindToGrammaticalClass: (rawEntry: I_Entry, rawClass: I_GrammaticalClass) => Promise<boolean>,
                    UnbindFromGrammaticalClass: (rawEntry: I_Entry, rawClass: I_GrammaticalClass) => Promise<boolean>,
                    BindToGrammaticalGenre: (rawEntry: I_Entry, rawGenre: I_GrammaticalGenre) => Promise<boolean>,
                    UnbindFromGrammaticalGenre: (rawEntry: I_Entry, rawGenre: I_GrammaticalGenre) => Promise<boolean>,
                    BindToTranslation: (rawEntry: I_Entry, rawTranslation: I_Entry) => Promise<boolean>,
                    UnbindFromTranslation: (rawEntry: I_Entry, rawTranslation: I_Entry) => Promise<boolean>,
                    Update: (rawEntry: I_Entry) => Promise<[boolean, I_Entry | undefined]>,
                    Delete: (rawEntry: I_Entry) => Promise<boolean>,
                },
                grammaticalClass: {
                    readAll: (dictionary_id: number) => Promise<I_GrammaticalClass[]>,
                    readAllByEntry: (entry_id: number) => Promise<I_GrammaticalClass[]>,
                    readOne: (grammatical_category_id: number) => Promise<I_GrammaticalClass>,
                    create: (grammatical_class: I_GrammaticalClass) => Promise<[boolean, I_GrammaticalClass | undefined]>,
                    update: (grammatical_class: I_GrammaticalClass) => Promise<[boolean, I_GrammaticalClass | undefined]>,
                    delete: (grammatical_class_id: number) => Promise<boolean>,
                },
                grammaticalGenre: {
                    readAll: (dictionary_id: number) => Promise<I_GrammaticalGenre[]>,
                    readAllByEntry: (entry_id: number) => Promise<I_GrammaticalGenre[]>,
                    readOne: (gramGenreId: number) => Promise<I_GrammaticalGenre>,
                    create: (grammatical_genre: I_GrammaticalGenre) => Promise<[boolean, I_GrammaticalGenre | undefined]>,
                    update: (grammatical_genre: I_GrammaticalGenre) => Promise<[boolean, I_GrammaticalGenre | undefined]>,
                    delete: (grammatical_genre_id: number) => Promise<boolean>,
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