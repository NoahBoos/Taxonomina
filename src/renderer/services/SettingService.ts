// import {EntryUIBuilder} from "@/old/builders/EntryUIBuilder";
// import {GrammaticalClassUIBuilder} from "@/old/builders/GrammaticalClassUIBuilder";
// import {GrammaticalGenreUIBuilder} from "@/old/builders/GrammaticalGenreUIBuilder";
// import {LanguageUIBuilder} from "@/old/builders/LanguageUIBuilder";

export class SettingService {
    public static async ChangeThemeVariant(variant: string) {
        document.body.setAttribute("data-variant", variant);
        await window.txnmAPI.settings.Update("themeVariant", variant);
    }

    public static async ChangeTheme(theme: string) {
        document.body.setAttribute("data-theme", theme);
        await window.txnmAPI.settings.Update("selectedTheme", theme);
    }

    public static async ChangeFontSize(fontSize: string) {
        document.body.setAttribute("data-font-size", fontSize);
        await window.txnmAPI.settings.Update("fontSize", fontSize);
    }

    public static async ChangeElementsPerPage(elementsPerPage: number) {
        // EntryUIBuilder.pageSize = elementsPerPage;
        // GrammaticalClassUIBuilder.pageSize = elementsPerPage;
        // GrammaticalGenreUIBuilder.pageSize = elementsPerPage;
        // LanguageUIBuilder.pageSize = elementsPerPage;
        await window.txnmAPI.settings.Update("elementsPerPage", elementsPerPage);
    }

    public static async ChangeScrollbarVisibility(scrollbarVisibility: boolean) {
        document.body.classList.toggle("hide-scrollbar", !scrollbarVisibility);
        await window.txnmAPI.settings.Update("scrollbarVisibility", scrollbarVisibility);
    }

    public static async ChangeHelpButtonVisibility(helpButtonVisibility: boolean) {
        document.querySelector("#help-window-button")!.classList.toggle("inactive", !helpButtonVisibility);
        await window.txnmAPI.settings.Update("helpButtonVisibility", helpButtonVisibility);
    }
}