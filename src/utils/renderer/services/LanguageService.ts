import {Language} from "../../../database/models/Language";

export class LanguageService {
    public static async ReadAll(): Promise<Language[]> {
        const rawLanguages: Language[] = await window.txnmAPI.repositories.language.ReadAll();
        return rawLanguages.map((rawLanguage: Language): Language => Language.Hydrate(rawLanguage));
    }
}