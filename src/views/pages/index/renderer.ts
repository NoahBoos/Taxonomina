import {LanguageUIBuilder} from "../../builders/LanguageUIBuilder";

async function Renderer() {
    console.log("[Renderer] - Renderer() called.");

    const languageDrawerButton: HTMLElement = document.getElementById("language-drawer-button")!;
    languageDrawerButton.addEventListener("click", (event: Event) => {
        LanguageUIBuilder.CreateAndHandleDrawer();
    })
}

console.log("[Renderer] - Loaded");
Renderer();