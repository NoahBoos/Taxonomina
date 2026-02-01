import {I_Dictionary} from "@/shared/interfaces/I_Dictionary";
import { settings, updateSetting } from "@/renderer/stores/settingsStore";
import { get } from "svelte/store";
import { refreshDictionaries } from "@/renderer/stores/dictionariesStore";
import { refreshCurrentDictionary } from "@/renderer/stores/currentDictionaryStore";
import { resetCurrentInspectorState } from "@/renderer/stores/currentInspectorStateStore";
import { resetCurrentBrowserTab } from "@/renderer/stores/currentBrowserTabStore";

export class DictionaryService {
    public static async readAll(): Promise<I_Dictionary[]> {
        return await window.txnmAPI.repositories.dictionary.readAll();
    }

    public static async readCurrentDictionary(): Promise<I_Dictionary> {
        return await window.txnmAPI.repositories.dictionary.readOne(get(settings)?.currentDictionary);
    }

    public static async readOne(dictionary_id: number): Promise<I_Dictionary> {
        return await window.txnmAPI.repositories.dictionary.readOne(dictionary_id);
    }

    public static async setCurrentDictionary(id: number): Promise<void> {
        await updateSetting("currentDictionary", id);
        await refreshDictionaries();
        await refreshCurrentDictionary();
        resetCurrentInspectorState();
        resetCurrentBrowserTab();
    }

    public static async save(dictionary: I_Dictionary): Promise<[boolean, I_Dictionary | undefined]> {
        let [success, savedDictionary] = dictionary.id == 0
            ? await window.txnmAPI.repositories.dictionary.create(dictionary)
            : await window.txnmAPI.repositories.dictionary.update(dictionary);
        return [success, savedDictionary];
    }

    public static async delete(dictionary_id: number): Promise<boolean> {
        return await window.txnmAPI.repositories.dictionary.delete(dictionary_id);
    }
}