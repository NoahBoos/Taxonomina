import {settings} from "@/renderer/stores/settingsStore";
import { I_Language } from "@/shared/interfaces/I_Language";
import { get, writable, Writable } from "svelte/store";
import { LanguageService } from "@/renderer/services/LanguageService";

export const languagesStore: Writable<I_Language[]> = writable([]);

export async function refreshLanguages(): Promise<void> {
    const dictionary_id: number | undefined = get(settings)?.currentDictionary;

    if (dictionary_id) {
        let languages: I_Language[] = await LanguageService.readAll(dictionary_id);
        languages.sort((a, b) => {
            const name_native_compare: number = a.name_native.localeCompare(b.name_native);
            const name_localized_compare: number = a.name_localized.localeCompare(b.name_localized);
            return name_native_compare !== 0 ? name_native_compare : name_localized_compare;
        })

        languagesStore.set(languages);
    }
    else languagesStore.set([]);
}