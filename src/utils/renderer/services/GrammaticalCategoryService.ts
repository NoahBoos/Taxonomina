import {GrammaticalCategory} from "../../../database/models/GrammaticalCategory";

export class GrammaticalCategoryService {
    public static async ReadAll(): Promise<GrammaticalCategory[]> {
        const rawGramCats: GrammaticalCategory[] = await window.txnmAPI.repositories.grammaticalCategory.ReadAll();
        return rawGramCats.map((rawGramCat: GrammaticalCategory): GrammaticalCategory => GrammaticalCategory.Hydrate(rawGramCat));
    }

    public static async ReadOne(gramCatId: number): Promise<GrammaticalCategory> {
        const rawGramCat: GrammaticalCategory = await window.txnmAPI.repositories.grammaticalCategory.ReadOne(gramCatId);
        return GrammaticalCategory.Hydrate(rawGramCat);
    }

    public static async Save(gramCat: GrammaticalCategory): Promise<boolean> {
        return gramCat.GetId() == 0
            ? await window.txnmAPI.repositories.grammaticalCategory.Create(gramCat)
            : await window.txnmAPI.repositories.grammaticalCategory.Update(gramCat);
    }

    public static async Delete(gramCat: GrammaticalCategory): Promise<boolean> {
        return await window.txnmAPI.repositories.grammaticalCategory.Delete(gramCat);
    }
}