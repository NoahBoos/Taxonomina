import {SelectOptions} from "@/renderer/types/SelectOptions";
import {LanguageService} from "@/renderer/services/LanguageService";
import {I_Language} from "@/shared/interfaces/I_Language";
import {FontSize} from "@/renderer/types/FontSize";
import {ElementsPerPage} from "@/renderer/types/ElementsPerPage";
import {Theme} from "@/renderer/types/Theme";
import {ThemeVariant} from "@/renderer/types/ThemeVariant";

export const DIRECTIONS: SelectOptions = {
    'ltr': "Gauche à droite",
    'rtl': "Droite à gauche"
}

export const LANGUAGES = async (dictionaryId: number): Promise<SelectOptions> => {
    const languages: I_Language[] = await LanguageService.readAll(dictionaryId);
    const options: SelectOptions = {};

    languages.forEach((language: I_Language) => {
        options[language.id] = `${language.name_native} / ${language.name_local}`
    });

    return options;
}

export const FONT_SIZES: Record<FontSize, string> = {
    'small': 'Petit',
    'base': 'Défault',
    'medium': 'Moyen',
    'large': 'Grand'
}

export const ELEMENTS_PER_PAGE: Record<ElementsPerPage, string> = {
    10: '10',
    20: '20',
    50: '50',
    100: '100'
}

export const THEMES: Record<Theme, string> = {
    'default': 'Défault',
    'nord': 'Nord'
}

export const THEME_VARIANTS: Record<ThemeVariant, string> = {
    'light': 'Clair',
    'dark': 'Sombre'
}