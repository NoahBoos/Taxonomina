import {settings} from "@/renderer/stores/settingsStore";
import { I_GrammaticalClass } from "@/shared/interfaces/I_GrammaticalClass";
import { get, Writable, writable } from "svelte/store";
import { GrammaticalClassService } from "@/renderer/services/GrammaticalClassService";

export const grammaticalClassesStore: Writable<I_GrammaticalClass[]> = writable([]);

export async function refreshGrammaticalClasses(): Promise<void>  {
    const dictionary_id: number | undefined = get(settings)?.currentDictionary;

    if (dictionary_id) {
        let grammatical_classes: I_GrammaticalClass[] = await GrammaticalClassService.readAll(dictionary_id);
        grammatical_classes.sort((a, b) => a.name.localeCompare(b.name));

        grammaticalClassesStore.set(grammatical_classes);
    }
    else grammaticalClassesStore.set([]);
}