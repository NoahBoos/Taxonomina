import {GrammaticalCategory} from "../database/models/GrammaticalCategory";
import {Entry} from "../database/models/Entry";
import {TaxonominaSettings} from "../interfaces/I_TaxonominaSettings";

export class GrammaticalCategoryService {
    public static async ReadAll(dictionary_id: number): Promise<GrammaticalCategory[]> {
        const rawGramCats: GrammaticalCategory[] = await window.txnmAPI.repositories.grammaticalCategory.ReadAll(dictionary_id);
        return rawGramCats.map((rawGramCat: GrammaticalCategory): GrammaticalCategory => GrammaticalCategory.Hydrate(rawGramCat));
    }

    public static async ReadAllByEntry(entry: Entry): Promise<GrammaticalCategory[]> {
        const rawGramCats: GrammaticalCategory[] = await window.txnmAPI.repositories.grammaticalCategory.ReadAllByEntry(entry);
        return rawGramCats.map((rawGramCat: GrammaticalCategory): GrammaticalCategory => GrammaticalCategory.Hydrate(rawGramCat));
    }

    public static async ReadOne(gramCatId: number): Promise<GrammaticalCategory> {
        const rawGramCat: GrammaticalCategory = await window.txnmAPI.repositories.grammaticalCategory.ReadOne(gramCatId);
        return GrammaticalCategory.Hydrate(rawGramCat);
    }

    public static async Save(gramCat: GrammaticalCategory): Promise<[boolean, GrammaticalCategory | undefined]> {
        let [success, savedGramCat] = gramCat.GetId() == 0
            ? await window.txnmAPI.repositories.grammaticalCategory.Create(gramCat)
            : await window.txnmAPI.repositories.grammaticalCategory.Update(gramCat);
        return [success, GrammaticalCategory.Hydrate(savedGramCat)];
    }

    public static async Delete(gramCat: GrammaticalCategory): Promise<boolean> {
        return await window.txnmAPI.repositories.grammaticalCategory.Delete(gramCat);
    }

    public static async FilterBySearch(dictionary_id: number, query: string): Promise<GrammaticalCategory[]> {
        const grammaticalCategories: GrammaticalCategory[] = await GrammaticalCategoryService.ReadAll(dictionary_id);
        return grammaticalCategories.filter(gc => {
            return gc.GetName().toLowerCase().includes(query.toLowerCase());
        });
    }

    public static async ProcessForm(form: Element): Promise<[boolean, GrammaticalCategory | undefined]> {
        const settings: TaxonominaSettings = await window.txnmAPI.settings.Load();
        const id: number = Number(form.querySelector<HTMLInputElement>("#id")!.value);
        const name: string = form.querySelector<HTMLInputElement>("#name")!.value;
        let grammaticalCategory: GrammaticalCategory = new GrammaticalCategory(id, settings.currentDictionary, name);
        if (!grammaticalCategory.Validate()) return [false, undefined];
        grammaticalCategory.Normalize();
        return await GrammaticalCategoryService.Save(grammaticalCategory);
    }
}