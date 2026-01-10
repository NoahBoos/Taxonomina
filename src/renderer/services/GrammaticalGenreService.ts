import {I_GrammaticalGenre} from "@/shared/interfaces/I_GrammaticalGenre";
import {I_Entry} from "@/shared/interfaces/I_Entry";

export class GrammaticalGenreService {
    public static async ReadAll(dictionary_id: number): Promise<I_GrammaticalGenre[]> {
        return await window.txnmAPI.repositories.grammaticalGenre.ReadAll(dictionary_id);
    }

    public static async ReadAllByEntry(entry: I_Entry): Promise<I_GrammaticalGenre[]> {
        return await window.txnmAPI.repositories.grammaticalGenre.ReadAllByEntry(entry);
    }

    public static async ReadOne(gramGenreId: number): Promise<I_GrammaticalGenre> {
        return await window.txnmAPI.repositories.grammaticalGenre.ReadOne(gramGenreId);
    }

    public static async Save(gramGenre: I_GrammaticalGenre): Promise<[boolean, I_GrammaticalGenre | undefined]> {
        let [success, savedGenre] = gramGenre.id == 0
            ? await window.txnmAPI.repositories.grammaticalGenre.Create(gramGenre)
            : await window.txnmAPI.repositories.grammaticalGenre.Update(gramGenre);
        return [success, savedGenre];
    }

    public static async Delete(gramGenre: I_GrammaticalGenre): Promise<boolean> {
        return await window.txnmAPI.repositories.grammaticalGenre.Delete(gramGenre);
    }

    // public static async FilterBySearch(dictionary_id: number, query: string): Promise<GrammaticalGenre[]> {
    //     const grammaticalGenres: GrammaticalGenre[] = await GrammaticalGenreService.ReadAll(dictionary_id);
    //     return grammaticalGenres.filter(gc => {
    //         return gc.GetName().toLowerCase().includes(query.toLowerCase());
    //     });
    // }
    //
    // public static async ProcessForm(form: Element): Promise<[boolean, GrammaticalGenre | undefined]> {
    //     const settings: I_TaxonominaSettings = await window.txnmAPI.settings.Load();
    //     const id: number = Number(form.querySelector<HTMLInputElement>("#id")!.value);
    //     const name: string = form.querySelector<HTMLInputElement>("#name")!.value;
    //     let grammaticalGenre: GrammaticalGenre = new GrammaticalGenre(id, settings.currentDictionary, name);
    //     if (!grammaticalGenre.Validate()) return [false, undefined];
    //     grammaticalGenre.Normalize();
    //     return await GrammaticalGenreService.Save(grammaticalGenre);
    // }
}