import {writable, Writable} from "svelte/store";
import {TaxonominaSettings} from "@/shared/interfaces/TaxonominaSettings";

export const settings: Writable<TaxonominaSettings | null> = writable<TaxonominaSettings | null>(null);

export async function loadSettings(): Promise<void> {
    const loaded = await window.txnmAPI.settings.Load();
    settings.set(loaded);
}

export async function updateSetting<K extends keyof TaxonominaSettings>(key: K, value: TaxonominaSettings[K]): Promise<void> {
    settings.update((current) => {
        if (!current) return current;
        return { ...current, [key]: value };
    });

    await window.txnmAPI.settings.Update(key, value);
}