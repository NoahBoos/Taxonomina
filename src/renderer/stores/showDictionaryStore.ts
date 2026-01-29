import { writable, Writable } from "svelte/store";

export const showDictionaryStore: Writable<boolean> = writable(false);

export function toggleShowDictionary(visibility: boolean | null = null): void {
    if (visibility) {
        showDictionaryStore.set(visibility);
    } else {
        showDictionaryStore.set(!showDictionaryStore)
    }
}