import {I_GrammaticalGenre} from "@/shared/interfaces/I_GrammaticalGenre";
import { ErrorDomain, TaxonominaError } from "@/shared/errors/types";

export class GrammaticalGenreService {
    public static async readAll(dictionary_id: number): Promise<I_GrammaticalGenre[]> {
        return await window.txnmAPI.repositories.grammaticalGenre.readAll(dictionary_id);
    }

    public static async readAllByEntry(entry_id: number): Promise<I_GrammaticalGenre[]> {
        return await window.txnmAPI.repositories.grammaticalGenre.readAllByEntry(entry_id);
    }

    public static async readOne(grammatical_genre_id: number): Promise<I_GrammaticalGenre> {
        return await window.txnmAPI.repositories.grammaticalGenre.readOne(grammatical_genre_id);
    }

    public static async save(grammatical_genre: I_GrammaticalGenre): Promise<[boolean, I_GrammaticalGenre | undefined, TaxonominaError<ErrorDomain>[]]> {
        let [success, savedGenre, errors] = grammatical_genre.id == 0
            ? await window.txnmAPI.repositories.grammaticalGenre.create(grammatical_genre)
            : await window.txnmAPI.repositories.grammaticalGenre.update(grammatical_genre);
        return [success, savedGenre, errors];
    }

    public static async delete(grammatical_genre_id: number): Promise<boolean> {
        return await window.txnmAPI.repositories.grammaticalGenre.delete(grammatical_genre_id);
    }
}