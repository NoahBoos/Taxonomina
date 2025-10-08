import {Language} from "../../../database/models/Language";
import {json} from "node:stream/consumers";

async function ParseHTMLFromString(path: string): Promise<Element | undefined> {
    try {
        const content: string | undefined = await window.txnmAPI.LoadTemplate(path);
        const parser = new DOMParser();
        const html: Document = parser.parseFromString(content!, "text/html");
        return html.body.firstElementChild ?? undefined;
    } catch (error) {
        console.error("An error happened trying to parse HTML from the provided template. \n", error);
        return undefined;
    }
}

async function Renderer() {
    console.log("[Renderer] - Renderer() called.");
    const leftLeaf: HTMLElement = document.getElementById("left-leaf")!;
    const rightLeaf: HTMLElement = document.getElementById("right-leaf")!;

    const languageDrawerButton: HTMLElement = document.getElementById("language-drawer-button")!;
    languageDrawerButton.addEventListener("click", (event: Event) => {
        CreateAndHandleLanguageDrawer(leftLeaf, rightLeaf);
    })
}

console.log("[Renderer] - Loaded");
Renderer();

// async function CreateAndHandleDictionaryForm(parent: HTMLElement) {
//     const dictionaryCreationForm: NodeListOf<ChildNode> | undefined = await ParseHTMLFromString("forms/dictionary");
//     parent.appendChild(dictionaryCreationForm!);
//
//     const button: HTMLButtonElement = dictionaryCreationForm!.querySelector<HTMLButtonElement>("#submit")!;
//     button?.addEventListener("click", async (event: Event) => {
//         event.preventDefault();
//         let dictionaryToCreate: { name: string; description: string } = {name: "", description: ""};
//         const inputNameValue: string = dictionaryCreationForm!.querySelector<HTMLInputElement>("#name")!.value ?? "";
//         const inputDescriptionValue: string = dictionaryCreationForm!.querySelector<HTMLInputElement>("#description")!.value ?? "";
//         if (inputNameValue == "") return;
//         dictionaryToCreate.name = inputNameValue;
//         dictionaryToCreate.description = inputDescriptionValue;
//         await window.txnmAPI.repositories.dictionary.Create(dictionaryToCreate);
//     });
// }

async function CreateAndHandleLanguageDrawer(leftLeaf: HTMLElement, rightLeaf: HTMLElement) {
    const languageDrawer: Element | undefined = await ParseHTMLFromString("drawers/language");
    if (languageDrawer) {
        leftLeaf.replaceChildren(languageDrawer);

        const languageFormButton: HTMLButtonElement = leftLeaf!.querySelector<HTMLButtonElement>("#language-form-button")!;
        languageFormButton?.addEventListener("click", async (event: Event) => {
            event.preventDefault();
            await CreateAndHandleLanguageForm(rightLeaf);
        })

        const languages: Language[] = await window.txnmAPI.repositories.language.ReadAll();
        console.log("[Renderer] - " + JSON.stringify(languages));
    }
}

async function CreateAndHandleLanguageForm(rightLeaf: HTMLElement) {
    const languageCreationForm: Element | undefined = await ParseHTMLFromString("forms/language");
    if (languageCreationForm) {
        rightLeaf.replaceChildren(languageCreationForm);

        const button: HTMLButtonElement = rightLeaf.querySelector<HTMLButtonElement>("#submit")!;
        button?.addEventListener("click", async (event: Event): Promise<void> => {
            event.preventDefault();
            let languageToCreate: { iso_639_1: string, iso_639_3: string, is_conlang: boolean, name_native: string, name_local: string, direction: string } = {
                iso_639_1: "", iso_639_3: "", is_conlang: false, name_native: "", name_local: "", direction: "ltr"
            }
            const inputISO6391: string = rightLeaf.querySelector<HTMLInputElement>("#iso_639_1")!.value ?? "";
            const inputISO6393: string = rightLeaf.querySelector<HTMLInputElement>("#iso_639_3")!.value ?? "";
            const inputIsConlang: boolean = rightLeaf.querySelector<HTMLInputElement>("#is_conlang")!.checked ?? false;
            const inputNameNative: string = rightLeaf.querySelector<HTMLInputElement>("#name_native")!.value ?? "";
            const inputNameLocal: string = rightLeaf.querySelector<HTMLInputElement>("#name_local")!.value ?? "";
            const inputDirection: string = rightLeaf.querySelector<HTMLInputElement>("#direction")!.value ?? "";
            if (inputNameNative == "" || inputNameLocal == "") return;
            languageToCreate.iso_639_1 = inputISO6391;
            languageToCreate.iso_639_3 = inputISO6393;
            languageToCreate.is_conlang = inputIsConlang;
            languageToCreate.name_native = inputNameNative;
            languageToCreate.name_local = inputNameLocal;
            languageToCreate.direction = inputDirection;
            const success: boolean = await window.txnmAPI.repositories.language.Create(languageToCreate);
            if (success) {
                const inputs: NodeListOf<HTMLInputElement> = rightLeaf.querySelectorAll<HTMLInputElement>("input")!;
                inputs.forEach((input: HTMLInputElement) => {
                    if (input.type === "checkbox") {
                        input.checked = false;
                    } else if (input.type === "text") {
                        input.value = "";
                    } else if (input.id === "direction") {
                        input.value = "ltr";
                    }
                })
            }
        })
    }
}