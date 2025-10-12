import {LanguageUIBuilder} from "../../builders/LanguageUIBuilder";
import {DictionaryUIBuilder} from "../../builders/DictionaryUIBuilder";

async function Renderer() {
    console.log("[Renderer] - Renderer() called.");

    await DictionaryUIBuilder.InitializeDictionarySection();

    const languageDrawerButton: HTMLElement = document.getElementById("language-drawer-button")!;
    languageDrawerButton.addEventListener("click", (event: Event) => {
        LanguageUIBuilder.CreateAndHandleDrawer();
    })
}

console.log("[Renderer] - Loaded");
Renderer();