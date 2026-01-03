import {LanguageUIBuilder} from "../../builders/LanguageUIBuilder";
import {DictionaryUIBuilder} from "../../builders/DictionaryUIBuilder";
import {GrammaticalClassUIBuilder} from "../../builders/GrammaticalClassUIBuilder";
import {GrammaticalGenreUIBuilder} from "../../builders/GrammaticalGenreUIBuilder";
import {EntryUIBuilder} from "../../builders/EntryUIBuilder";
import {SettingUIBuilder} from "../../builders/SettingUIBuilder";
import {TaxonominaSettings} from "../../../shared/interfaces/I_TaxonominaSettings";

export let settings: TaxonominaSettings;

async function IndexRenderer() {
    settings = await window.txnmAPI.settings.Load();
    await InitializeTheme();

    await DictionaryUIBuilder.Initialize();

    await LanguageUIBuilder.Initialize();
    await GrammaticalClassUIBuilder.Initialize();
    await GrammaticalGenreUIBuilder.Initialize();
    await EntryUIBuilder.Initialize();

    await SettingUIBuilder.Initialize();
}

async function InitializeTheme() {
    const settings: TaxonominaSettings = await window.txnmAPI.settings.Expose();
    document.body.setAttribute("data-theme", settings.selectedTheme);
    document.body.setAttribute("data-variant", settings.themeVariant);
    document.body.setAttribute("data-font-size", settings.fontSize);
    document.body.classList.toggle("hide-scrollbar", !settings.scrollbarVisibility);
    document.querySelector("#help-window-button")!.classList.toggle("inactive", !settings.helpButtonVisibility);
    EntryUIBuilder.pageSize = settings.elementsPerPage;
    GrammaticalClassUIBuilder.pageSize = settings.elementsPerPage;
    GrammaticalGenreUIBuilder.pageSize = settings.elementsPerPage;
    LanguageUIBuilder.pageSize = settings.elementsPerPage;
}

export function GetSettings() {
    return settings;
}

export function SetSettings(newSettings: TaxonominaSettings) {
    settings = newSettings;
}

addEventListener("DOMContentLoaded", IndexRenderer);