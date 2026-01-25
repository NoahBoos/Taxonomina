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
                    readAll: (dictionary_id: number) => Promise<I_Entry[]>,
                    readAllByGlobalTranslation: (entry_id: number) => Promise<I_Entry[]>,
                    readAllByLocalTranslation: (definition_id: number) => Promise<I_Entry[]>,
                    readOne: (entry_id: number) => Promise<I_Entry>,
                    create: (entry: I_Entry) => Promise<[boolean, I_Entry | undefined]>,
                    update: (entry: I_Entry) => Promise<[boolean, I_Entry | undefined]>,
                    delete: (entry_id: number) => Promise<boolean>,
                    bindToGrammaticalClass: (entry_id: number, grammatical_class_id: number) => Promise<boolean>,
                    unbindFromGrammaticalClass: (entry_id: number, grammatical_class_id: number) => Promise<boolean>,
                    bindToGrammaticalGenre: (entry_id: number, grammatical_genre_id: number) => Promise<boolean>,
                    unbindFromGrammaticalGenre: (entry_id: number, grammatical_genre_id: number) => Promise<boolean>,
                    bindToTranslation: (entry_id: number, translation_id: number) => Promise<boolean>,
                    unbindFromTranslation: (entry_id: number, translation_id: number) => Promise<boolean>,
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
                    readAll: (dictionary_id: number) => Promise<I_Language[]>,
                    readOne: (language_id: number) => Promise<I_Language>,
                    create: (language: I_Language) => Promise<[boolean, I_Language | undefined]>,
                    update: (language: I_Language) => Promise<[boolean, I_Language | undefined]>,
                    delete: (language_id: number) => Promise<boolean>
                }
            }
        }
    }
}