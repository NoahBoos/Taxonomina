import {I_GrammaticalGenre} from "@/shared/interfaces/I_GrammaticalGenre";
import {I_Entry} from "@/shared/interfaces/I_Entry";

export class GrammaticalGenreService {
    public static async ReadAll(dictionary_id: number): Promise<I_GrammaticalGenre[]> {
        return await window.txnmAPI.repositories.grammaticalGenre.readAll(dictionary_id);
    }

    public static async ReadAllByEntry(entry: I_Entry): Promise<I_GrammaticalGenre[]> {
        return await window.txnmAPI.repositories.grammaticalGenre.readAllByEntry(entry.id);
    }

    public static async ReadOne(gramGenreId: number): Promise<I_GrammaticalGenre> {
        return await window.txnmAPI.repositories.grammaticalGenre.readOne(gramGenreId);
    }

    public static async Save(gramGenre: I_GrammaticalGenre): Promise<[boolean, I_GrammaticalGenre | undefined]> {
        let [success, savedGenre] = gramGenre.id == 0
            ? await window.txnmAPI.repositories.grammaticalGenre.create(gramGenre)
            : await window.txnmAPI.repositories.grammaticalGenre.update(gramGenre);
        return [success, savedGenre];
    }

    public static async Delete(gramGenre: I_GrammaticalGenre): Promise<boolean> {
        return await window.txnmAPI.repositories.grammaticalGenre.delete(gramGenre.id);
    }
}