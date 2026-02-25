import { writable, Writable } from "svelte/store";
import { I_Dictionary } from "@/shared/interfaces/I_Dictionary";
import { DictionaryService } from "@/renderer/services/DictionaryService";

export const dictionariesStore: Writable<I_Dictionary[]> = writable([]);

export async function refreshDictionaries(): Promise<void> {
    let dictionaries: I_Dictionary[] = await DictionaryService.readAll();
    dictionaries.sort((a, b) => a.name.localeCompare(b.name));

    dictionariesStore.set(dictionaries);
}