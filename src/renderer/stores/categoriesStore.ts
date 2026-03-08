import {settings} from "@/renderer/stores/settingsStore";
import { I_Category } from "@/shared/interfaces/I_Category";
import { get, Writable, writable } from "svelte/store";
import { CategoryService } from "@/renderer/services/CategoryService";

export const categoriesStore: Writable<I_Category[]> = writable([]);

export async function refreshCategories(): Promise<void>  {
    const dictionary_id: number | undefined = get(settings)?.currentDictionary;

    if (dictionary_id) {
        let categories: I_Category[] = await CategoryService.readAll(dictionary_id);
        categories.sort((a, b) => a.name.localeCompare(b.name));

        categoriesStore.set(categories);
    }
    else categoriesStore.set([]);
}