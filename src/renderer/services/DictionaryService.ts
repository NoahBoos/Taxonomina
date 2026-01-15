import {I_TaxonominaSettings} from "../../shared/interfaces/I_TaxonominaSettings";
import {I_Dictionary} from "@/shared/interfaces/I_Dictionary";
// import {SetSettings} from "../pages/index/index.renderer";

export class DictionaryService {
    public static async GetCurrentDictionary(): Promise<I_Dictionary> {
        let settings: I_TaxonominaSettings = await window.txnmAPI.settings.Expose();
        return await window.txnmAPI.repositories.dictionary.ReadOne(settings.currentDictionary);
    }

    public static async SetCurrentDictionary(dictionary: I_Dictionary): Promise<void> {
        await window.txnmAPI.settings.Update("currentDictionary", dictionary.id);
        // SetSettings(await window.txnmAPI.settings.Expose());
    }

    public static async GetAllDictionaries(): Promise<I_Dictionary[]> {
        return await window.txnmAPI.repositories.dictionary.ReadAll();
    }

    public static async GetAllDictionariesButOne(dictionaryToIgnore: I_Dictionary): Promise<I_Dictionary[]> {
        return await window.txnmAPI.repositories.dictionary.ReadAllButOne(dictionaryToIgnore);
    }

    public static async Delete(dictionary: I_Dictionary): Promise<boolean> {
        return await window.txnmAPI.repositories.dictionary.Delete(dictionary);
    }

    public static async Save(dictionary: I_Dictionary): Promise<[boolean, I_Dictionary | undefined]> {
        let [success, savedDictionary] = dictionary.id == 0
            ? await window.txnmAPI.repositories.dictionary.Create(dictionary)
            : await window.txnmAPI.repositories.dictionary.Update(dictionary);
        return [success, savedDictionary];
    }

    // public static async ProcessForm(form: Element): Promise<[boolean, I_Dictionary | undefined]> {
    //     const id: number = Number(form.querySelector<HTMLInputElement>("#id")!.value);
    //     const name: string = form.querySelector<HTMLInputElement>("#name")!.value;
    //     const description: string = form.querySelector<HTMLInputElement>("#description")!.value;
    //     let dictionary: I_Dictionary = new I_Dictionary(id, name, description);
    //     if (!dictionary.Validate()) return [false, undefined];
    //     dictionary.Normalize();
    //     return await DictionaryService.Save(dictionary);
    // }
}