import {GrammaticalGenre} from "../../../database/models/GrammaticalGenre";
import {Entry} from "../../../database/models/Entry";

export class GrammaticalGenreService {
    public static async ReadAll(): Promise<GrammaticalGenre[]> {
        const rawGramGenres: GrammaticalGenre[] = await window.txnmAPI.repositories.grammaticalGenre.ReadAll();
        return rawGramGenres.map((rawGramGenre: GrammaticalGenre): GrammaticalGenre => GrammaticalGenre.Hydrate(rawGramGenre));
    }

    public static async ReadAllByEntry(entry: Entry): Promise<GrammaticalGenre[]> {
        const rawGramGenres: GrammaticalGenre[] = await window.txnmAPI.repositories.grammaticalGenre.ReadAllByEntry(entry);
        return rawGramGenres.map((rawGramCat: GrammaticalGenre): GrammaticalGenre => GrammaticalGenre.Hydrate(rawGramCat));
    }

    public static async ReadOne(gramGenreId: number): Promise<GrammaticalGenre> {
        const rawGramGenre: GrammaticalGenre = await window.txnmAPI.repositories.grammaticalGenre.ReadOne(gramGenreId);
        return GrammaticalGenre.Hydrate(rawGramGenre);
    }

    public static async Save(gramGenre: GrammaticalGenre): Promise<[boolean, GrammaticalGenre | undefined]> {
        let [success, savedGenre] = gramGenre.GetId() == 0
            ? await window.txnmAPI.repositories.grammaticalGenre.Create(gramGenre)
            : await window.txnmAPI.repositories.grammaticalGenre.Update(gramGenre);
        return [success, GrammaticalGenre.Hydrate(savedGenre)];
    }

    public static async Delete(gramGenre: GrammaticalGenre): Promise<boolean> {
        return await window.txnmAPI.repositories.grammaticalGenre.Delete(gramGenre);
    }

    public static async ProcessForm(form: Element): Promise<[boolean, GrammaticalGenre | undefined]> {
        const id: number = Number(form.querySelector<HTMLInputElement>("#id")!.value);
        const name: string = form.querySelector<HTMLInputElement>("#name")!.value;
        let grammaticalGenre: GrammaticalGenre = new GrammaticalGenre(id, name);
        if (!grammaticalGenre.Validate()) return [false, undefined];
        grammaticalGenre.Normalize();
        return await GrammaticalGenreService.Save(grammaticalGenre);
    }
}