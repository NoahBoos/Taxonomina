import {writable, Writable} from "svelte/store";
import {I_TaxonominaSettings} from "@/shared/interfaces/I_TaxonominaSettings";

export const settings: Writable<I_TaxonominaSettings | null> = writable<I_TaxonominaSettings | null>(null);

export async function loadSettings(): Promise<void> {
    const loaded = await window.txnmAPI.settings.Load();
    settings.set(loaded);
}

export async function updateSetting<K extends keyof I_TaxonominaSettings>(key: K, value: I_TaxonominaSettings[K]): Promise<void> {
    settings.update((current) => {
        if (!current) return current;
        return { ...current, [key]: value };
    });

    await window.txnmAPI.settings.Update(key, value);
}