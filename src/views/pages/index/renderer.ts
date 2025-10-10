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

    const languageDrawerButton: HTMLElement = document.getElementById("language-drawer-button")!;
    languageDrawerButton.addEventListener("click", (event: Event) => {
        CreateAndHandleLanguageDrawer();
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

/**
 * Initializes and manages the Language Drawer UI section.
 *
 * This drawer provides an interface for language management, including:
 * - a working search bar for filtering languages by ISO codes or names,
 * - a button to open the language creation form,
 * - and a dynamically generated list of existing languages.
 *
 * Each displayed language item acts as a button that opens its edition form on click.
 *
 * **Functional flow:**
 * 1. Fetches and parses the drawer HTML template.
 * 2. If parsed successfully, the drawer is injected into main's left container (`leftLeaf`).
 * 3. Loads existing languages from `window.txnmAPI.repositories.language`.
 * 4. Initializes the search bar to filter the displayed languages in real-time.
 * 5. Adds an event listener on the creation button to load the creation form into main's right container (`rightLeaf`).
 * 6. Renders the initial and full list of languages using `DisplayLanguageThumbnails()`.
 *
 * **Returns:**
 * @returns {Promise<void>} Resolves when the drawer UI and event handlers are fully initialized.
 */
async function CreateAndHandleLanguageDrawer(): Promise<void> {
    const leftLeaf: HTMLElement = document.getElementById("left-leaf")!;
    const languageDrawer: Element | undefined = await ParseHTMLFromString("drawers/language");
    if (languageDrawer) {
        leftLeaf.replaceChildren(languageDrawer);

        const languagesRaw = await window.txnmAPI.repositories.language.ReadAll();
        let languages: Language[] = languagesRaw.map(Language.Hydrate);

        const languageSearchbar: HTMLInputElement = leftLeaf.querySelector<HTMLInputElement>("#searchbar")!;
        languageSearchbar.addEventListener("input", async (event: Event) => {
            const query: string = languageSearchbar.value.toLowerCase();
            const filteredLanguages: Language[] = languagesRaw.map(Language.Hydrate).filter((language: Language) => {
                return [language.GetIso639_1(), language.GetIso639_3(), language.GetNameNative(), language.GetNameLocal()]
                    .some(value => value.toLowerCase().includes(query.toLowerCase()));
            });
            console.log(filteredLanguages);
            await DisplayLanguageThumbnails(filteredLanguages);
        })

        const createFormButton: HTMLButtonElement = leftLeaf!.querySelector<HTMLButtonElement>("#create-button")!;
        createFormButton?.addEventListener("click", async (event: Event) => {
            event.preventDefault();
            await CreateAndHandleLanguageForm();
        })

        await DisplayLanguageThumbnails(languages);
        console.log("[Renderer] - " + JSON.stringify(languages));
    }
}

/**
 * Renders and manages the list of language thumbnails within the Language Drawer UI.
 *
 * Each language is represented as a thumbnail element built from a predefined HTML template.
 * These thumbnails act as clickable buttons, each opening the corresponding language edition form
 * in the main's right container (`rightLeaf`).
 *
 * **Functional flow:**
 * 1. Selects and clears the language container inside the left panel (`leftLeaf`).
 * 2. Loads the base HTML thumbnail template via `window.txnmAPI.LoadTemplate("thumbnails/language")`.
 * 3. Iterates through the provided `languages` array.
 * 4. For each language:
 *    - Replaces template placeholders (`{{id}}`, `{{name_native}}`, `{{name_local}}`) with actual data.
 *    - Parses the resulting HTML string into a DOM element.
 *    - Attaches a click event listener that opens the corresponding edition form through `CreateAndHandleLanguageForm()`.
 *    - Appends the thumbnail to the language container.
 * 5. Logs any parsing or rendering error without interrupting the iteration.
 *
 * **Parameters:**
 * @param {Language[]} languages - The array of language instances to be displayed as thumbnails.
 *
 * **Returns:**
 * @returns {Promise<void>} Resolves when all language thumbnails have been rendered and event handlers attached.
 */
async function DisplayLanguageThumbnails(languages: Language[]): Promise<void> {
    const leftLeaf: HTMLElement = document.getElementById("left-leaf")!;
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
                await CreateAndHandleLanguageForm(language);
            })

            return languageContainer.append(thumbnailElement);
        } catch (error) {
            console.error("An error happened trying to parse HTML from the provided template. \n", error);
            return undefined;
        }
    })
}

async function CreateAndHandleLanguageForm(language?: Language) {
    const leftLeaf: HTMLElement = document.getElementById("left-leaf")!;
    const rightLeaf: HTMLElement = document.getElementById("right-leaf")!;
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

            if (inputNameNative.value == "" || inputNameLocal.value == "") return;

            let language: Language = new Language(
                parseInt(inputId.value) ?? 0,
                inputISO6391.value ?? "",
                inputISO6393.value ?? "",
                inputIsConlang.checked ?? false,
                inputNameNative.value ?? "",
                inputNameLocal.value ?? "",
                inputDirection.value ?? "ltr",
            );

            let success: boolean
            if (language.GetId() == 0) {
                success = await window.txnmAPI.repositories.language.Create(language);
            } else {
                success = await window.txnmAPI.repositories.language.Update(language);
            }

            if (success) {
                const query: string = leftLeaf.querySelector<HTMLInputElement>("#searchbar")!.value;
                await CreateAndHandleLanguageDrawer();
                const searchbar: HTMLInputElement = leftLeaf.querySelector<HTMLInputElement>("#searchbar")!;
                searchbar.value = query;
                const filteredLanguages: Language[] = await window.txnmAPI.repositories.language.ReadAll().then(
                    (languagesRaw: Language[]): Language[] => {
                        return languagesRaw.map(Language.Hydrate).filter((language: Language) => {
                            return [language.GetIso639_1(), language.GetIso639_3(), language.GetNameNative(), language.GetNameLocal()]
                                .some(value => value.toLowerCase().includes(query.toLowerCase()));
                        })
                    }
                );
                await DisplayLanguageThumbnails(filteredLanguages);
                await CreateAndHandleLanguageForm(language ? language : undefined);
            }
        })
    }
}