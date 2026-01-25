import {I_GrammaticalClass} from "@/shared/interfaces/I_GrammaticalClass";
import {I_Entry} from "@/shared/interfaces/I_Entry";

export class GrammaticalClassService {
    public static async readAll(dictionary_id: number): Promise<I_GrammaticalClass[]> {
        return await window.txnmAPI.repositories.grammaticalClass.readAll(dictionary_id);
    }

    public static async readAllByEntry(entry: I_Entry): Promise<I_GrammaticalClass[]> {
        return await window.txnmAPI.repositories.grammaticalClass.readAllByEntry(entry.id);
    }

    public static async readOne(gramCatId: number): Promise<I_GrammaticalClass> {
        return await window.txnmAPI.repositories.grammaticalClass.readOne(gramCatId);
    }

    public static async save(gramCat: I_GrammaticalClass): Promise<[boolean, I_GrammaticalClass | undefined]> {
        let [success, savedGramCat] = gramCat.id == 0
            ? await window.txnmAPI.repositories.grammaticalClass.create(gramCat)
            : await window.txnmAPI.repositories.grammaticalClass.update(gramCat);
        return [success, savedGramCat];
    }

    public static async delete(gramCat: I_GrammaticalClass): Promise<boolean> {
        return await window.txnmAPI.repositories.grammaticalClass.delete(gramCat.id);
    }
}