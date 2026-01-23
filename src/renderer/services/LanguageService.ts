import {I_Language} from "@/shared/interfaces/I_Language";

export class LanguageService {
    public static async ReadAll(dictionary_id: number): Promise<I_Language[]> {
        return await window.txnmAPI.repositories.language.readAll(dictionary_id);
    }

    public static async ReadOne(languageId: number): Promise<I_Language> {
        return await window.txnmAPI.repositories.language.readOne(languageId);
    }

    public static async Save(language: I_Language): Promise<[boolean, I_Language | undefined]> {
        let [success, savedLanguage] = language.id == 0
            ? await window.txnmAPI.repositories.language.create(language)
            : await window.txnmAPI.repositories.language.update(language);
        return [success, savedLanguage];
    }

    public static async Delete(language: I_Language) {
        return await window.txnmAPI.repositories.language.delete(language.id);
    }

    // public static async FilterBySearch(dictionary_id: number, query: string): Promise<Language[]> {
    //     const languages: Language[] = await LanguageService.ReadAll(dictionary_id);
    //     return languages.filter(loopedLanguage => {
    //         return [loopedLanguage.GetIso639_1(), loopedLanguage.GetIso639_3(), loopedLanguage.GetNameNative(), loopedLanguage.GetNameLocal()]
    //             .some(value => value.toLowerCase().includes(query.toLowerCase()));
    //     });
    // }
    //
    // public static async ProcessForm(form: Element): Promise<[boolean, Language | undefined]> {
    //     const settings: I_TaxonominaSettings = await window.txnmAPI.settings.Load();
    //     const id: number = Number(form.querySelector<HTMLInputElement>("#id")!.value);
    //     const iso_639_1: string = form.querySelector<HTMLInputElement>("#iso_639_1")!.value;
    //     const iso_639_3: string = form.querySelector<HTMLInputElement>("#iso_639_3")!.value;
    //     const is_conlang: boolean = form.querySelector<HTMLInputElement>("#is_conlang")!.checked;
    //     const name_native: string = form.querySelector<HTMLInputElement>("#name_native")!.value;
    //     const name_local: string = form.querySelector<HTMLInputElement>("#name_local")!.value;
    //     const direction: string = form.querySelector<HTMLInputElement>("#direction")!.value;
    //     let language: Language = new Language(id, settings.currentDictionary, iso_639_1, iso_639_3, is_conlang, name_native, name_local, direction);
    //     if (!language.Validate()) return [false, undefined];
    //     language.Normalize();
    //     return await LanguageService.Save(language);
    // }
}