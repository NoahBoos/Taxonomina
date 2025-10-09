import {Language} from "../../../database/models/Language";

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

        const languagesRaw = await window.txnmAPI.repositories.language.ReadAll();
        const languages: Language[] = languagesRaw.map(
            (data: any) => new Language(
                data.id, data.iso_639_1, data.iso_639_3, data.is_conlang, data.name_native, data.name_local, data.direction
            )
        );

        const languageSearchbar: HTMLInputElement = leftLeaf.querySelector<HTMLInputElement>("#language-searchbar")!;
        languageSearchbar.addEventListener("input", async (event: Event) => {
            const query: string = languageSearchbar.value.toLowerCase();
            const filteredLanguages: Language[] = languages.filter((language: Language) => {
                return language.GetIso639_1().toLowerCase().includes(query)
                    || language.GetIso639_3().toLowerCase().includes(query)
                    || language.GetNameNative().toLowerCase().includes(query)
                    || language.GetNameLocal().toLowerCase().includes(query);
            });
            console.log(filteredLanguages);
            await DisplayLanguageThumbnails(leftLeaf, rightLeaf, filteredLanguages);
        })

        const createFormButton: HTMLButtonElement = leftLeaf!.querySelector<HTMLButtonElement>("#create-form-button")!;
        createFormButton?.addEventListener("click", async (event: Event) => {
            event.preventDefault();
            await CreateAndHandleLanguageForm(rightLeaf);
        })

        await DisplayLanguageThumbnails(leftLeaf, rightLeaf, languages);
        console.log("[Renderer] - " + JSON.stringify(languages));
    }
}

async function DisplayLanguageThumbnails(leftLeaf: HTMLElement, rightLeaf: HTMLElement, languages: Language[]) {
    const languageContainer: HTMLElement = leftLeaf.querySelector("#language-container")!;
    languageContainer.replaceChildren();
    const languageThumbnail: string | undefined = await window.txnmAPI.LoadTemplate("thumbnails/language");
    languages.forEach((language: Language) => {
    let thumbnail: string = languageThumbnail!;
    thumbnail = thumbnail.replace("{{id}}", String(language.GetId()));
    thumbnail = thumbnail.replace("{{name_native}}", language.GetNameNative());
    thumbnail = thumbnail.replace("{{name_local}}", language.GetNameLocal());
    try {
        const content: string | undefined = thumbnail;
        const parser = new DOMParser();
        const html: Document = parser.parseFromString(content!, "text/html");
        const thumbnailElement: Element = html.body.firstElementChild!;
        const thumbnailElementButton: HTMLButtonElement = thumbnailElement.querySelector<HTMLButtonElement>("button")!;
        thumbnailElementButton!.addEventListener("click", async (event: Event) => {
            await CreateAndHandleLanguageForm(rightLeaf, language);
        })
        return languageContainer.append(thumbnailElement);
    } catch (error) {
        console.error("An error happened trying to parse HTML from the provided template. \n", error);
        return undefined;
    }
})
}

async function CreateAndHandleLanguageForm(rightLeaf: HTMLElement, language?: Language) {
    const languageCreationForm: Element | undefined = await ParseHTMLFromString("forms/language");
    if (languageCreationForm) {
        rightLeaf.replaceChildren(languageCreationForm);

        const inputISO6391: HTMLInputElement = rightLeaf.querySelector<HTMLInputElement>("#iso_639_1")!;
        const inputISO6393: HTMLInputElement = rightLeaf.querySelector<HTMLInputElement>("#iso_639_3")!;
        const inputIsConlang: HTMLInputElement = rightLeaf.querySelector<HTMLInputElement>("#is_conlang")!;
        const inputNameNative: HTMLInputElement = rightLeaf.querySelector<HTMLInputElement>("#name_native")!;
        const inputNameLocal: HTMLInputElement = rightLeaf.querySelector<HTMLInputElement>("#name_local")!;
        const inputDirection: HTMLInputElement = rightLeaf.querySelector<HTMLInputElement>("#direction")!;
        const inputId: HTMLInputElement = rightLeaf.querySelector<HTMLInputElement>("#id")!;
        if (language) {
            inputISO6391.value = language.GetIso639_1();
            inputISO6393.value = language.GetIso639_3();
            inputIsConlang.checked = language.GetIsConlang();
            inputNameNative.value = language.GetNameNative();
            inputNameLocal.value = language.GetNameLocal();
            inputDirection.value = language.GetDirection();
            inputId.value = String(language.GetId());
        }

        const button: HTMLButtonElement = rightLeaf.querySelector<HTMLButtonElement>("#submit")!;
        button?.addEventListener("click", async (event: Event): Promise<void> => {
            event.preventDefault();
            let languageToCreate: { iso_639_1: string, iso_639_3: string, is_conlang: boolean, name_native: string, name_local: string, direction: string } = {
                iso_639_1: "", iso_639_3: "", is_conlang: false, name_native: "", name_local: "", direction: "ltr"
            }
            if (inputNameNative.value == "" || inputNameLocal.value == "") return;
            languageToCreate.iso_639_1 = inputISO6391.value ?? "";
            languageToCreate.iso_639_3 = inputISO6393.value ?? "";
            languageToCreate.is_conlang = inputIsConlang.checked ?? false;
            languageToCreate.name_native = inputNameNative.value ?? "";
            languageToCreate.name_local = inputNameLocal.value ?? "";
            languageToCreate.direction = inputDirection.value ?? "";
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