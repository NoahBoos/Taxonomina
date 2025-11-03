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

    public static async Save(language: Language): Promise<[boolean, Language | undefined]> {
        let [success, savedLanguage] = language.GetId() == 0
            ? await window.txnmAPI.repositories.language.Create(language)
            : await window.txnmAPI.repositories.language.Update(language);
        return [success, Language.Hydrate(savedLanguage)];
    }

    public static async Delete(language: Language) {
        return await window.txnmAPI.repositories.language.Delete(language);
    }
}