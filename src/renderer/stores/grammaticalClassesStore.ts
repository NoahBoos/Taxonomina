import {settings} from "@/renderer/stores/settingsStore";
import { I_GrammaticalClass } from "@/shared/interfaces/I_GrammaticalClass";
import { get, Writable, writable } from "svelte/store";
import { GrammaticalClassService } from "@/renderer/services/GrammaticalClassService";

export const grammaticalClassesStore: Writable<I_GrammaticalClass[]> = writable([]);

export async function refreshGrammaticalClasses(): Promise<void>  {
    const dictionary_id: number | undefined = get(settings)?.currentDictionary;

    if (dictionary_id) grammaticalClassesStore.set(await GrammaticalClassService.readAll(dictionary_id));
    else grammaticalClassesStore.set([]);
}