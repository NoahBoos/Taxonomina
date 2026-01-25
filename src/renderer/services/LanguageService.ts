import {I_Language} from "@/shared/interfaces/I_Language";

export class LanguageService {
    public static async ReadAll(dictionary_id: number): Promise<I_Language[]> {
        return await window.txnmAPI.repositories.language.readAll(dictionary_id);
    }

    public static async ReadOne(languageId: number): Promise<I_Language> {
        return await window.txnmAPI.repositories.language.readOne(languageId);
    }

    public static async Save(language: I_Language): Promise<[boolean, I_Language | undefined]> {
        let [success, savedLanguage] = language.id == 0
            ? await window.txnmAPI.repositories.language.create(language)
            : await window.txnmAPI.repositories.language.update(language);
        return [success, savedLanguage];
    }

    public static async Delete(language: I_Language) {
        return await window.txnmAPI.repositories.language.delete(language.id);
    }
}