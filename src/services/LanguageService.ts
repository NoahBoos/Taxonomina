import {Language} from "../database/models/Language";

export class LanguageService {
    public static async ReadAll(): Promise<Language[]> {
        const rawLanguages: Language[] = await window.txnmAPI.repositories.language.ReadAll();
        return rawLanguages.map((rawLanguage: Language): Language => Language.Hydrate(rawLanguage));
    }

    public static async ReadOne(languageId: number): Promise<Language> {
        const rawLanguage: Language = await window.txnmAPI.repositories.language.ReadOne(languageId);
        return Language.Hydrate(rawLanguage);
    }

    public static async Save(language: Language): Promise<[boolean, Language | undefined]> {
        let [success, savedLanguage] = language.GetId() == 0
            ? await window.txnmAPI.repositories.language.Create(language)
            : await window.txnmAPI.repositories.language.Update(language);
        return [success, Language.Hydrate(savedLanguage)];
    }

    public static async Delete(language: Language) {
        return await window.txnmAPI.repositories.language.Delete(language);
    }

    public static async FilterBySearch(query: string): Promise<Language[]> {
        const languages: Language[] = await LanguageService.ReadAll();
        return languages.filter(loopedLanguage => {
            return [loopedLanguage.GetIso639_1(), loopedLanguage.GetIso639_3(), loopedLanguage.GetNameNative(), loopedLanguage.GetNameLocal()]
                .some(value => value.toLowerCase().includes(query.toLowerCase()));
        });
    }

    public static async ProcessForm(form: Element): Promise<[boolean, Language | undefined]> {
        const id: number = Number(form.querySelector<HTMLInputElement>("#id")!.value);
        const iso_639_1: string = form.querySelector<HTMLInputElement>("#iso_639_1")!.value;
        const iso_639_3: string = form.querySelector<HTMLInputElement>("#iso_639_3")!.value;
        const is_conlang: boolean = form.querySelector<HTMLInputElement>("#is_conlang")!.checked;
        const name_native: string = form.querySelector<HTMLInputElement>("#name_native")!.value;
        const name_local: string = form.querySelector<HTMLInputElement>("#name_local")!.value;
        const direction: string = form.querySelector<HTMLInputElement>("#direction")!.value;
        let language: Language = new Language(id, iso_639_1, iso_639_3, is_conlang, name_native, name_local, direction);
        if (!language.Validate()) return [false, undefined];
        language.Normalize();
        return await LanguageService.Save(language);
    }
}