import {GrammaticalGenre} from "@/main/database/models/GrammaticalGenre";
import {Entry} from "@/main/database/models/Entry";
import {I_TaxonominaSettings} from "../../shared/interfaces/I_TaxonominaSettings";

export class GrammaticalGenreService {
    public static async ReadAll(dictionary_id: number): Promise<GrammaticalGenre[]> {
        const rawGramGenres: GrammaticalGenre[] = await window.txnmAPI.repositories.grammaticalGenre.ReadAll(dictionary_id);
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

    public static async FilterBySearch(dictionary_id: number, query: string): Promise<GrammaticalGenre[]> {
        const grammaticalGenres: GrammaticalGenre[] = await GrammaticalGenreService.ReadAll(dictionary_id);
        return grammaticalGenres.filter(gc => {
            return gc.GetName().toLowerCase().includes(query.toLowerCase());
        });
    }

    public static async ProcessForm(form: Element): Promise<[boolean, GrammaticalGenre | undefined]> {
        const settings: I_TaxonominaSettings = await window.txnmAPI.settings.Load();
        const id: number = Number(form.querySelector<HTMLInputElement>("#id")!.value);
        const name: string = form.querySelector<HTMLInputElement>("#name")!.value;
        let grammaticalGenre: GrammaticalGenre = new GrammaticalGenre(id, settings.currentDictionary, name);
        if (!grammaticalGenre.Validate()) return [false, undefined];
        grammaticalGenre.Normalize();
        return await GrammaticalGenreService.Save(grammaticalGenre);
    }
}