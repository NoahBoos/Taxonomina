import {Writable, writable} from "svelte/store";
import {I_Dictionary} from "@/shared/interfaces/I_Dictionary";
import {DictionaryService} from "@/renderer/services/DictionaryService";

export const currentDictionary: Writable<I_Dictionary | null> = writable(null);

export async function setCurrentDictionary(id: number) {
    await DictionaryService.setCurrentDictionary(id);
}

export async function refreshCurrentDictionary() {
    const dictionary: I_Dictionary = await DictionaryService.readCurrentDictionary();
    currentDictionary.set(dictionary);
}