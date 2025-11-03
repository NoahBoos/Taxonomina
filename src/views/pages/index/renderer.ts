import {LanguageUIBuilder} from "../../builders/LanguageUIBuilder";
import {DictionaryUIBuilder} from "../../builders/DictionaryUIBuilder";
import {GrammaticalCategoryUIBuilder} from "../../builders/GrammaticalCategoryUIBuilder";
import {GrammaticalGenreUIBuilder} from "../../builders/GrammaticalGenreUIBuilder";
import {EntryUIBuilder} from "../../builders/EntryUIBuilder";

async function Renderer() {
    await DictionaryUIBuilder.InitializeDictionarySection();

    await LanguageUIBuilder.Initialize();
    await GrammaticalCategoryUIBuilder.Initialize();
    await GrammaticalGenreUIBuilder.Initialize();
    await EntryUIBuilder.Initialize();
}

Renderer();