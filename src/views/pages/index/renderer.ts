import {LanguageUIBuilder} from "../../../builders/LanguageUIBuilder";
import {DictionaryUIBuilder} from "../../../builders/DictionaryUIBuilder";
import {GrammaticalCategoryUIBuilder} from "../../../builders/GrammaticalCategoryUIBuilder";
import {GrammaticalGenreUIBuilder} from "../../../builders/GrammaticalGenreUIBuilder";
import {EntryUIBuilder} from "../../../builders/EntryUIBuilder";
import {SettingUIBuilder} from "../../../builders/SettingUIBuilder";
import {TaxonominaSettings} from "../../../interfaces/I_TaxonominaSettings";

async function Renderer() {
    await InitializeTheme();

    await DictionaryUIBuilder.InitializeDictionarySection();

    await LanguageUIBuilder.Initialize();
    await GrammaticalCategoryUIBuilder.Initialize();
    await GrammaticalGenreUIBuilder.Initialize();
    await EntryUIBuilder.Initialize();

    await SettingUIBuilder.Initialize();
}

async function InitializeTheme() {
    const settings: TaxonominaSettings = await window.txnmAPI.settings.Expose();
    document.body.setAttribute("data-theme", settings.selectedTheme);
    document.body.setAttribute("data-variant", settings.themeVariant);
    document.body.setAttribute("data-font-size", settings.fontSize);
}

Renderer();