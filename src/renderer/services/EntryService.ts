import {I_Entry} from "@/shared/interfaces/I_Entry";
import { ErrorDomain, TaxonominaError } from "@/shared/errors/types";

export class EntryService {
    public static async readAll(dictionary_id: number): Promise<I_Entry[]> {
        return await window.txnmAPI.repositories.entry.readAll(dictionary_id);
    }

    public static async readAllByGlobalTranslation(entry_id: number): Promise<I_Entry[]> {
        return await window.txnmAPI.repositories.entry.readAllByGlobalTranslation(entry_id);
    }

    public static async readAllByLocalTranslation(definition_id: number): Promise<I_Entry[]> {
        return await window.txnmAPI.repositories.entry.readAllByLocalTranslation(definition_id);
    }

    public static async readOne(entry_id: number): Promise<I_Entry> {
        return await window.txnmAPI.repositories.entry.readOne(entry_id);
    }

    public static async save(entry: I_Entry): Promise<[boolean, I_Entry | undefined, TaxonominaError<ErrorDomain>[]]> {
        let [success, savedEntry, errors] = entry.id == 0
            ? await window.txnmAPI.repositories.entry.create(entry)
            : await window.txnmAPI.repositories.entry.update(entry);
        return [success, savedEntry, errors];
    }

    public static async delete(entry_id: number): Promise<boolean> {
        return await window.txnmAPI.repositories.entry.delete(entry_id);
    }

    public static async bindToGrammaticalClass(entry_id: number, grammatical_class_id: number): Promise<boolean> {
        return await window.txnmAPI.repositories.entry.bindToGrammaticalClass(entry_id, grammatical_class_id);
    }

    public static async unbindFromGrammaticalClass(entry_id: number, grammatical_class_id: number): Promise<boolean> {
        return await window.txnmAPI.repositories.entry.unbindFromGrammaticalClass(entry_id, grammatical_class_id);
    }

    public static async bindToGrammaticalGenre(entry_id: number, grammatical_genre_id: number): Promise<boolean> {
        return await window.txnmAPI.repositories.entry.bindToGrammaticalGenre(entry_id, grammatical_genre_id);
    }

    public static async unbindFromGrammaticalGenre(entry_id: number, grammatical_genre_id: number): Promise<boolean> {
        return await window.txnmAPI.repositories.entry.unbindFromGrammaticalGenre(entry_id, grammatical_genre_id);
    }

    public static async bindToTranslation(entry_id: number, translation_id: number): Promise<boolean> {
        return await window.txnmAPI.repositories.entry.bindToTranslation(entry_id, translation_id);
    }

    public static async unbindFromTranslation(entry_id: number, translation_id: number): Promise<boolean> {
        return await window.txnmAPI.repositories.entry.unbindFromTranslation(entry_id, translation_id);
    }
}