import {I_TaxonominaSettings} from "../../shared/interfaces/I_TaxonominaSettings";
import {I_Dictionary} from "@/shared/interfaces/I_Dictionary";
// import {SetSettings} from "../pages/index/index.renderer";

export class DictionaryService {
    public static async getCurrentDictionary(): Promise<I_Dictionary> {
        let settings: I_TaxonominaSettings = await window.txnmAPI.settings.Expose();
        return await window.txnmAPI.repositories.dictionary.readOne(settings.currentDictionary);
    }

    public static async setCurrentDictionary(dictionary: I_Dictionary): Promise<void> {
        await window.txnmAPI.settings.Update("currentDictionary", dictionary.id);
        // SetSettings(await window.txnmAPI.settings.Expose());
    }

    public static async getAllDictionaries(): Promise<I_Dictionary[]> {
        return await window.txnmAPI.repositories.dictionary.readAll();
    }

    public static async delete(dictionary: I_Dictionary): Promise<boolean> {
        return await window.txnmAPI.repositories.dictionary.delete(dictionary);
    }

    public static async save(dictionary: I_Dictionary): Promise<[boolean, I_Dictionary | undefined]> {
        let [success, savedDictionary] = dictionary.id == 0
            ? await window.txnmAPI.repositories.dictionary.create(dictionary)
            : await window.txnmAPI.repositories.dictionary.update(dictionary);
        return [success, savedDictionary];
    }
}