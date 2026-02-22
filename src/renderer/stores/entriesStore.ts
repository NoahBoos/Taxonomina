import { get, Writable, writable } from "svelte/store";
import { I_Entry } from "@/shared/interfaces/I_Entry";
import { EntryService } from "@/renderer/services/EntryService";
import {settings} from "@/renderer/stores/settingsStore";

export const entriesStore: Writable<I_Entry[]> = writable([]);

export async function refreshEntries(): Promise<void> {
    const dictionary_id: number | undefined = get(settings)?.currentDictionary;

    if (dictionary_id) entriesStore.set(await EntryService.readAll(dictionary_id));
    else entriesStore.set([]);
}