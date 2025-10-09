import {Language} from "./database/models/Language";

export {};

declare global {
    interface Window {
        txnmAPI: {
            LoadTemplate: (path: string) => Promise<string | undefined>,
            repositories: {
                dictionary: {
                    Create: (data: { name: string; description: string }) => Promise<boolean>
                },
                language: {
                    ReadAll: () => Promise<Language[]>,
                    Create: (data: { iso_639_1: string, iso_639_3: string, is_conlang: boolean, name_native: string, name_local: string, direction: string }) => Promise<boolean>,
                    Update: (rawLanguage: Language) => Promise<boolean>,
                }
            }
        }
    }
}