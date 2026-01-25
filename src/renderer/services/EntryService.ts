import {I_Entry} from "@/shared/interfaces/I_Entry";
import {I_Definition} from "@/shared/interfaces/I_Definition";
import {I_GrammaticalClass} from "@/shared/interfaces/I_GrammaticalClass";
import {I_GrammaticalGenre} from "@/shared/interfaces/I_GrammaticalGenre";

export class EntryService {
    public static async readAll(dictionary_id: number): Promise<I_Entry[]> {
        return await window.txnmAPI.repositories.entry.readAll(dictionary_id);
    }

    public static async readAllByGlobalTranslation(entry: I_Entry): Promise<I_Entry[]> {
        return await window.txnmAPI.repositories.entry.readAllByGlobalTranslation(entry.id);
    }

    public static async readAllByLocalTranslation(definition: I_Definition): Promise<I_Entry[]> {
        return await window.txnmAPI.repositories.entry.readAllByLocalTranslation(definition.id);
    }

    public static async readOne(entry_id: number): Promise<I_Entry> {
        return await window.txnmAPI.repositories.entry.readOne(entry_id);
    }

    public static async save(entry: I_Entry): Promise<[boolean, I_Entry | undefined]> {
        let [success, savedEntry] = entry.id == 0
            ? await window.txnmAPI.repositories.entry.create(entry)
            : await window.txnmAPI.repositories.entry.update(entry);
        return [success, savedEntry];
    }

    public static async delete(entry: I_Entry): Promise<boolean> {
        return await window.txnmAPI.repositories.entry.delete(entry.id);
    }

    public static async bindToGrammaticalClass(entry: I_Entry, grammaticalClass: I_GrammaticalClass) {
        return await window.txnmAPI.repositories.entry.bindToGrammaticalClass(entry.id, grammaticalClass.id);
    }

    public static async unbindFromGrammaticalClass(entry: I_Entry, grammaticalClass: I_GrammaticalClass) {
        return await window.txnmAPI.repositories.entry.unbindFromGrammaticalClass(entry.id, grammaticalClass.id);
    }

    public static async bindToGrammaticalGenre(entry: I_Entry, grammatical_genre: I_GrammaticalGenre) {
        return await window.txnmAPI.repositories.entry.bindToGrammaticalGenre(entry.id, grammatical_genre.id);
    }

    public static async unbindFromGrammaticalGenre(entry: I_Entry, grammatical_genre: I_GrammaticalGenre) {
        return await window.txnmAPI.repositories.entry.unbindFromGrammaticalGenre(entry.id, grammatical_genre.id);
    }

    public static async bindToTranslation(entry: I_Entry, translation: I_Entry) {
        return await window.txnmAPI.repositories.entry.bindToTranslation(entry.id, translation.id);
    }

    public static async unbindFromTranslation(entry: I_Entry, translation: I_Entry) {
        return await window.txnmAPI.repositories.entry.unbindFromTranslation(entry.id, translation.id);
    }
}