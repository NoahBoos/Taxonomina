import {I_Entry} from "@/shared/interfaces/I_Entry";
import {I_Definition} from "@/shared/interfaces/I_Definition";
import {I_GrammaticalClass} from "@/shared/interfaces/I_GrammaticalClass";
import {I_GrammaticalGenre} from "@/shared/interfaces/I_GrammaticalGenre";

export class EntryService {
    public static async ReadAll(dictionary_id: number): Promise<I_Entry[]> {
        return await window.txnmAPI.repositories.entry.readAll(dictionary_id);
    }

    public static async ReadAllByGlobalTranslation(entry: I_Entry): Promise<I_Entry[]> {
        return await window.txnmAPI.repositories.entry.readAllByGlobalTranslation(entry.id);
    }

    public static async ReadAllByLocalTranslation(definition: I_Definition): Promise<I_Entry[]> {
        return await window.txnmAPI.repositories.entry.readAllByLocalTranslation(definition.id);
    }

    public static async ReadOne(entry_id: number): Promise<I_Entry> {
        return await window.txnmAPI.repositories.entry.readOne(entry_id);
    }

    public static async Save(entry: I_Entry): Promise<[boolean, I_Entry | undefined]> {
        let [success, savedEntry] = entry.id == 0
            ? await window.txnmAPI.repositories.entry.create(entry)
            : await window.txnmAPI.repositories.entry.update(entry);
        return [success, savedEntry];
    }

    public static async Delete(entry: I_Entry): Promise<boolean> {
        return await window.txnmAPI.repositories.entry.delete(entry.id);
    }

    public static async BindToGrammaticalClass(entry: I_Entry, grammaticalClass: I_GrammaticalClass) {
        return await window.txnmAPI.repositories.entry.bindToGrammaticalClass(entry.id, grammaticalClass.id);
    }

    public static async UnbindFromGrammaticalClass(entry: I_Entry, grammaticalClass: I_GrammaticalClass) {
        return await window.txnmAPI.repositories.entry.unbindFromGrammaticalClass(entry.id, grammaticalClass.id);
    }

    public static async BindToGrammaticalGenre(entry: I_Entry, grammatical_genre: I_GrammaticalGenre) {
        return await window.txnmAPI.repositories.entry.bindToGrammaticalGenre(entry.id, grammatical_genre.id);
    }

    public static async UnbindFromGrammaticalGenre(entry: I_Entry, grammatical_genre: I_GrammaticalGenre) {
        return await window.txnmAPI.repositories.entry.unbindFromGrammaticalGenre(entry.id, grammatical_genre.id);
    }

    public static async BindToTranslation(entry: I_Entry, translation: I_Entry) {
        return await window.txnmAPI.repositories.entry.bindToTranslation(entry.id, translation.id);
    }

    public static async UnbindFromTranslation(entry: I_Entry, translation: I_Entry) {
        return await window.txnmAPI.repositories.entry.unbindFromTranslation(entry.id, translation.id);
    }
}