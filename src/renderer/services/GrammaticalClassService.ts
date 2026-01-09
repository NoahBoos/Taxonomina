import {I_GrammaticalClass} from "@/shared/interfaces/I_GrammaticalClass";
import {I_Entry} from "@/shared/interfaces/I_Entry";

export class GrammaticalClassService {
    public static async ReadAll(dictionary_id: number): Promise<I_GrammaticalClass[]> {
        return await window.txnmAPI.repositories.grammaticalClass.ReadAll(dictionary_id);
    }

    public static async ReadAllByEntry(entry: I_Entry): Promise<I_GrammaticalClass[]> {
        return await window.txnmAPI.repositories.grammaticalClass.ReadAllByEntry(entry);
    }

    public static async ReadOne(gramCatId: number): Promise<I_GrammaticalClass> {
        return await window.txnmAPI.repositories.grammaticalClass.ReadOne(gramCatId);
    }

    public static async Save(gramCat: I_GrammaticalClass): Promise<[boolean, I_GrammaticalClass | undefined]> {
        let [success, savedGramCat] = gramCat.id == 0
            ? await window.txnmAPI.repositories.grammaticalClass.Create(gramCat)
            : await window.txnmAPI.repositories.grammaticalClass.Update(gramCat);
        return [success, savedGramCat];
    }

    public static async Delete(gramCat: I_GrammaticalClass): Promise<boolean> {
        return await window.txnmAPI.repositories.grammaticalClass.Delete(gramCat);
    }

    // public static async FilterBySearch(dictionary_id: number, query: string): Promise<GrammaticalClass[]> {
    //     const grammaticalCategories: GrammaticalClass[] = await GrammaticalClassService.ReadAll(dictionary_id);
    //     return grammaticalCategories.filter(gc => {
    //         return gc.GetName().toLowerCase().includes(query.toLowerCase());
    //     });
    // }
    //
    // public static async ProcessForm(form: Element): Promise<[boolean, GrammaticalClass | undefined]> {
    //     const settings: I_TaxonominaSettings = await window.txnmAPI.settings.Load();
    //     const id: number = Number(form.querySelector<HTMLInputElement>("#id")!.value);
    //     const name: string = form.querySelector<HTMLInputElement>("#name")!.value;
    //     let grammaticalCategory: GrammaticalClass = new GrammaticalClass(id, settings.currentDictionary, name);
    //     if (!grammaticalCategory.Validate()) return [false, undefined];
    //     grammaticalCategory.Normalize();
    //     return await GrammaticalClassService.Save(grammaticalCategory);
    // }
}