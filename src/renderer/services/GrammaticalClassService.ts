import {I_GrammaticalClass} from "@/shared/interfaces/I_GrammaticalClass";
import { ErrorDomain, TaxonominaError } from "@/shared/errors/types";

export class GrammaticalClassService {
    public static async readAll(dictionary_id: number): Promise<I_GrammaticalClass[]> {
        return await window.txnmAPI.repositories.grammaticalClass.readAll(dictionary_id);
    }

    public static async readAllByEntry(entry_id: number): Promise<I_GrammaticalClass[]> {
        return await window.txnmAPI.repositories.grammaticalClass.readAllByEntry(entry_id);
    }

    public static async readOne(grammatical_class_id: number): Promise<I_GrammaticalClass> {
        return await window.txnmAPI.repositories.grammaticalClass.readOne(grammatical_class_id);
    }

    public static async save(grammatical_class: I_GrammaticalClass): Promise<[boolean, I_GrammaticalClass | undefined, TaxonominaError<ErrorDomain>[]]> {
        let [success, saved_grammatical_class, errors] = grammatical_class.id == 0
            ? await window.txnmAPI.repositories.grammaticalClass.create(grammatical_class)
            : await window.txnmAPI.repositories.grammaticalClass.update(grammatical_class);
        return [success, saved_grammatical_class, errors];
    }

    public static async delete(grammatical_class_id: number): Promise<boolean> {
        return await window.txnmAPI.repositories.grammaticalClass.delete(grammatical_class_id);
    }
}