import {SelectOptions} from "@/renderer/types/SelectOptions";
import {LanguageService} from "@/renderer/services/LanguageService";
import {I_Language} from "@/shared/interfaces/I_Language";

export const DIRECTION: SelectOptions = {
    'ltr': "Gauche à droite",
    'rtl': "Droite à gauche"
}

export const LANGUAGES = async (dictionaryId: number): Promise<SelectOptions> => {
    const languages: I_Language[] = await LanguageService.ReadAll(dictionaryId);
    const options: SelectOptions = {};

    languages.forEach((language: I_Language) => {
        options[language.id] = `${language.name_native} / ${language.name_local}`
    });

    return options;
}