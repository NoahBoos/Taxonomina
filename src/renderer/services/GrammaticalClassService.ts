import {GrammaticalClass} from "../../shared/models/GrammaticalClass";
import {Entry} from "../../shared/models/Entry";
import {TaxonominaSettings} from "../../shared/interfaces/I_TaxonominaSettings";

export class GrammaticalClassService {
    public static async ReadAll(dictionary_id: number): Promise<GrammaticalClass[]> {
        const rawGramCats: GrammaticalClass[] = await window.txnmAPI.repositories.grammaticalClass.ReadAll(dictionary_id);
        return rawGramCats.map((rawGramCat: GrammaticalClass): GrammaticalClass => GrammaticalClass.Hydrate(rawGramCat));
    }

    public static async ReadAllByEntry(entry: Entry): Promise<GrammaticalClass[]> {
        const rawGramCats: GrammaticalClass[] = await window.txnmAPI.repositories.grammaticalClass.ReadAllByEntry(entry);
        return rawGramCats.map((rawGramCat: GrammaticalClass): GrammaticalClass => GrammaticalClass.Hydrate(rawGramCat));
    }

    public static async ReadOne(gramCatId: number): Promise<GrammaticalClass> {
        const rawGramCat: GrammaticalClass = await window.txnmAPI.repositories.grammaticalClass.ReadOne(gramCatId);
        return GrammaticalClass.Hydrate(rawGramCat);
    }

    public static async Save(gramCat: GrammaticalClass): Promise<[boolean, GrammaticalClass | undefined]> {
        let [success, savedGramCat] = gramCat.GetId() == 0
            ? await window.txnmAPI.repositories.grammaticalClass.Create(gramCat)
            : await window.txnmAPI.repositories.grammaticalClass.Update(gramCat);
        return [success, GrammaticalClass.Hydrate(savedGramCat)];
    }

    public static async Delete(gramCat: GrammaticalClass): Promise<boolean> {
        return await window.txnmAPI.repositories.grammaticalClass.Delete(gramCat);
    }

    public static async FilterBySearch(dictionary_id: number, query: string): Promise<GrammaticalClass[]> {
        const grammaticalCategories: GrammaticalClass[] = await GrammaticalClassService.ReadAll(dictionary_id);
        return grammaticalCategories.filter(gc => {
            return gc.GetName().toLowerCase().includes(query.toLowerCase());
        });
    }

    public static async ProcessForm(form: Element): Promise<[boolean, GrammaticalClass | undefined]> {
        const settings: TaxonominaSettings = await window.txnmAPI.settings.Load();
        const id: number = Number(form.querySelector<HTMLInputElement>("#id")!.value);
        const name: string = form.querySelector<HTMLInputElement>("#name")!.value;
        let grammaticalCategory: GrammaticalClass = new GrammaticalClass(id, settings.currentDictionary, name);
        if (!grammaticalCategory.Validate()) return [false, undefined];
        grammaticalCategory.Normalize();
        return await GrammaticalClassService.Save(grammaticalCategory);
    }
}