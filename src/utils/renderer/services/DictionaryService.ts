import {Dictionary} from "../../../database/models/Dictionary";
import {TaxonominaSettings} from "../../../interfaces/I_TaxonominaSettings";

export class DictionaryService {
    public static async GetCurrentDictionary(): Promise<Dictionary> {
        let settings: TaxonominaSettings = await window.txnmAPI.settings.Expose();
        let currentDictionary: Dictionary = await window.txnmAPI.repositories.dictionary.ReadOne(settings.currentDictionary);
        return Dictionary.Hydrate(currentDictionary);
    }

    public static async SetCurrentDictionary(dictionary: Dictionary): Promise<void> {
        return await window.txnmAPI.settings.Update("currentDictionary", dictionary.GetId());
    }

    public static async GetAllDictionaries(): Promise<Dictionary[]> {
        const rawDictionaries = await window.txnmAPI.repositories.dictionary.ReadAll();
        return rawDictionaries.map((dictionary: Dictionary): Dictionary => Dictionary.Hydrate(dictionary));
    }

    public static async GetAllDictionariesButOne(dictionaryToIgnore: Dictionary): Promise<Dictionary[]> {
        const rawDictionaries = await window.txnmAPI.repositories.dictionary.ReadAllButOne(dictionaryToIgnore);
        return rawDictionaries.map((dictionary: Dictionary): Dictionary => Dictionary.Hydrate(dictionary));
    }

    public static async Create(dictionary: Dictionary): Promise<boolean> {
        return await window.txnmAPI.repositories.dictionary.Create(dictionary);
    }

    public static async Update(dictionary: Dictionary): Promise<boolean> {
        return await window.txnmAPI.repositories.dictionary.Update(dictionary);
    }

    public static async Delete(dictionary: Dictionary): Promise<boolean> {
        return await window.txnmAPI.repositories.dictionary.Delete(dictionary);
    }

    public static async Save(dictionary: Dictionary): Promise<boolean> {
        return dictionary.GetId() == 0
            ? await DictionaryService.Create(dictionary)
            : await DictionaryService.Update(dictionary);
    }
}