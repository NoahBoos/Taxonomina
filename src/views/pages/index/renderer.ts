import {LanguageUIBuilder} from "../../builders/LanguageUIBuilder";
import {DictionaryUIBuilder} from "../../builders/DictionaryUIBuilder";
import {GrammaticalCategoryUIBuilder} from "../../builders/GrammaticalCategoryUIBuilder";

async function Renderer() {
    console.log("[Renderer] - Renderer() called.");

    await DictionaryUIBuilder.InitializeDictionarySection();

    const languageDrawerButton: HTMLElement = document.getElementById("language-drawer-button")!;
    languageDrawerButton.addEventListener("click", (event: Event) => {
        LanguageUIBuilder.CreateAndHandleDrawer();
    })

    await GrammaticalCategoryUIBuilder.Initialize();
}

console.log("[Renderer] - Loaded");
Renderer();