import {Language} from "../../../database/models/Language";

export class LanguageService {
    public static async ReadAll(): Promise<Language[]> {
        const rawLanguages: Language[] = await window.txnmAPI.repositories.language.ReadAll();
        return rawLanguages.map((rawLanguage: Language): Language => Language.Hydrate(rawLanguage));
    }

    public static async ReadOne(languageId: number): Promise<Language> {
        const rawLanguage: Language = await window.txnmAPI.repositories.language.ReadOne(languageId);
        return Language.Hydrate(rawLanguage);
    }
}