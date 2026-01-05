import {Dictionary} from "../../shared/models/Dictionary";
import {TaxonominaSettings} from "../../shared/interfaces/I_TaxonominaSettings";
// import {SetSettings} from "../pages/index/index.renderer";

export class DictionaryService {
    public static async GetCurrentDictionary(): Promise<Dictionary> {
        let settings: TaxonominaSettings = await window.txnmAPI.settings.Expose();
        let currentDictionary: Dictionary = await window.txnmAPI.repositories.dictionary.ReadOne(settings.currentDictionary);
        return Dictionary.Hydrate(currentDictionary);
    }

    public static async SetCurrentDictionary(dictionary: Dictionary): Promise<void> {
        await window.txnmAPI.settings.Update("currentDictionary", dictionary.GetId());
        // SetSettings(await window.txnmAPI.settings.Expose());
    }

    public static async GetAllDictionaries(): Promise<Dictionary[]> {
        const rawDictionaries = await window.txnmAPI.repositories.dictionary.ReadAll();
        return rawDictionaries.map((dictionary: Dictionary): Dictionary => Dictionary.Hydrate(dictionary));
    }

    public static async GetAllDictionariesButOne(dictionaryToIgnore: Dictionary): Promise<Dictionary[]> {
        const rawDictionaries = await window.txnmAPI.repositories.dictionary.ReadAllButOne(dictionaryToIgnore);
        return rawDictionaries.map((dictionary: Dictionary): Dictionary => Dictionary.Hydrate(dictionary));
    }

    public static async Delete(dictionary: Dictionary): Promise<boolean> {
        return await window.txnmAPI.repositories.dictionary.Delete(dictionary);
    }

    public static async Save(dictionary: Dictionary): Promise<[boolean, Dictionary | undefined]> {
        let [success, savedDictionary] = dictionary.GetId() == 0
            ? await window.txnmAPI.repositories.dictionary.Create(dictionary)
            : await window.txnmAPI.repositories.dictionary.Update(dictionary);
        return [success, Dictionary.Hydrate(savedDictionary)];
    }

    public static async ProcessForm(form: Element): Promise<[boolean, Dictionary | undefined]> {
        const id: number = Number(form.querySelector<HTMLInputElement>("#id")!.value);
        const name: string = form.querySelector<HTMLInputElement>("#name")!.value;
        const description: string = form.querySelector<HTMLInputElement>("#description")!.value;
        let dictionary: Dictionary = new Dictionary(id, name, description);
        if (!dictionary.Validate()) return [false, undefined];
        dictionary.Normalize();
        return await DictionaryService.Save(dictionary);
    }
}