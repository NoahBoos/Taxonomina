import {GrammaticalGenre} from "../../../database/models/GrammaticalGenre";

export class GrammaticalGenreService {
    public static async ReadAll(): Promise<GrammaticalGenre[]> {
        const rawGramGenres: GrammaticalGenre[] = await window.txnmAPI.repositories.grammaticalGenre.ReadAll();
        return rawGramGenres.map((rawGramGenre: GrammaticalGenre): GrammaticalGenre => GrammaticalGenre.Hydrate(rawGramGenre));
    }

    public static async ReadOne(gramGenreId: number): Promise<GrammaticalGenre> {
        const rawGramGenre: GrammaticalGenre = await window.txnmAPI.repositories.grammaticalGenre.ReadOne(gramGenreId);
        return GrammaticalGenre.Hydrate(rawGramGenre);
    }

    public static async Save(gramGenre: GrammaticalGenre): Promise<boolean> {
        return gramGenre.GetId() == 0
            ? await window.txnmAPI.repositories.grammaticalGenre.Create(gramGenre)
            : await window.txnmAPI.repositories.grammaticalGenre.Update(gramGenre);
    }

    public static async Delete(gramGenre: GrammaticalGenre): Promise<boolean> {
        return await window.txnmAPI.repositories.grammaticalGenre.Delete(gramGenre);
    }
}