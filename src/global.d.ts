import {Language} from "./database/models/Language";

export {};

declare global {
    interface Window {
        txnmAPI: {
            LoadTemplateAsString: (templatePath: string) => Promise<string | undefined>,
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