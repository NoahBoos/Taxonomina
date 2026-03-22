import { I_Category } from "@/shared/interfaces/I_Category";
import { ErrorDomain, TaxonominaError } from "@/shared/errors/types";

export class CategoryService {
    public static async readAll(dictionary_id: number): Promise<I_Category[]> {
        return await window.txnmAPI.repositories.category.readAll(dictionary_id);
    }

    public static async readAllByDefinition(definition_id: number): Promise<I_Category[]> {
        return await window.txnmAPI.repositories.category.readAllByDefinition(definition_id);
    }

    public static async readOne(category_id: number): Promise<I_Category> {
        return await window.txnmAPI.repositories.category.readOne(category_id);
    }

    public static async save(category: I_Category): Promise<[boolean, I_Category | undefined, TaxonominaError<ErrorDomain>[]]> {
        let [success, savedCategory, errors] = category.id == 0
            ? await window.txnmAPI.repositories.category.create(category)
            : await window.txnmAPI.repositories.category.update(category);
        return [success, savedCategory, errors];
    }

    public static async delete(category_id: number): Promise<boolean> {
        return await window.txnmAPI.repositories.category.delete(category_id);
    }

    public static async bindToDefinition(category_id: number, definition_id: number): Promise<boolean> {
        return await window.txnmAPI.repositories.category.bindToDefinition(category_id, definition_id);
    }

    public static async unbindFromDefinition(category_id: number, definition_id: number): Promise<boolean> {
        return await window.txnmAPI.repositories.category.unbindFromDefinition(category_id, definition_id);
    }
}