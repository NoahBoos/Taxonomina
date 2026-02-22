import {I_Language} from "@/shared/interfaces/I_Language";
import { ErrorDomain, TaxonominaError } from "@/shared/errors/types";

export class LanguageService {
    public static async readAll(dictionary_id: number): Promise<I_Language[]> {
        return await window.txnmAPI.repositories.language.readAll(dictionary_id);
    }

    public static async readOne(language_id: number): Promise<I_Language> {
        return await window.txnmAPI.repositories.language.readOne(language_id);
    }

    public static async save(language: I_Language): Promise<[boolean, I_Language | undefined, TaxonominaError<ErrorDomain>[]]> {
        let [success, savedLanguage, errors] = language.id == 0
            ? await window.txnmAPI.repositories.language.create(language)
            : await window.txnmAPI.repositories.language.update(language);
        return [success, savedLanguage, errors];
    }

    public static async delete(language_id: number): Promise<boolean> {
        return await window.txnmAPI.repositories.language.delete(language_id);
    }
}