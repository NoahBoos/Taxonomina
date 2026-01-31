import {Writable, writable} from "svelte/store";
import {I_Dictionary} from "@/shared/interfaces/I_Dictionary";
import {DictionaryService} from "@/renderer/services/DictionaryService";
import { refreshDictionaries } from "@/renderer/stores/dictionariesStore";

export const currentDictionary: Writable<I_Dictionary | null> = writable(null);

export async function setCurrentDictionary(id: number) {
    await DictionaryService.setCurrentDictionary(id);
    await refreshDictionaries();
}

export async function refreshCurrentDictionary() {
    const dictionary: I_Dictionary = await DictionaryService.readCurrentDictionary();
    currentDictionary.set(dictionary);
}