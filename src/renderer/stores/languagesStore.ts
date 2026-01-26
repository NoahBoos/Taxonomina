import {settings} from "@/renderer/stores/settingsStore";
import { I_Language } from "@/shared/interfaces/I_Language";
import { get, writable, Writable } from "svelte/store";
import { LanguageService } from "@/renderer/services/LanguageService";

export const languagesStore: Writable<I_Language[]> = writable([]);

export async function refreshLanguages(): Promise<void> {
    const dictionary_id: number | undefined = get(settings)?.currentDictionary;

    if (dictionary_id) languagesStore.set(await LanguageService.readAll(dictionary_id));
    else languagesStore.set([]);
}