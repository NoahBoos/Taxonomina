import {I_Language} from "@/shared/interfaces/I_Language";

export class LanguageService {
    public static async readAll(dictionary_id: number): Promise<I_Language[]> {
        return await window.txnmAPI.repositories.language.readAll(dictionary_id);
    }

    public static async readOne(languageId: number): Promise<I_Language> {
        return await window.txnmAPI.repositories.language.readOne(languageId);
    }

    public static async save(language: I_Language): Promise<[boolean, I_Language | undefined]> {
        let [success, savedLanguage] = language.id == 0
            ? await window.txnmAPI.repositories.language.create(language)
            : await window.txnmAPI.repositories.language.update(language);
        return [success, savedLanguage];
    }

    public static async delete(language: I_Language) {
        return await window.txnmAPI.repositories.language.delete(language.id);
    }
}