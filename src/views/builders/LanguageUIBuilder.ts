import {Language} from "../../database/models/Language";
import {TemplateManager} from "../../utils/renderer/TemplateManager";

export class LanguageUIBuilder {
    /**
     * Initializes and manages the **Language Drawer** UI component.
     *
     * This asynchronous function builds the interactive language management panel,
     * handling both UI rendering and event wiring for user interactions.
     *
     * **Overview:**
     * The Language Drawer provides tools for managing application languages, including:
     * - A live search bar to filter languages by ISO codes or names.
     * - A “+” button that opens a creation form.
     * - A dynamically rendered list of all existing languages.
     *
     * Each listed language acts as a button that loads its corresponding edit form on click.
     *
     * **Functional Flow:**
     * 1. Fetches and parses the drawer’s HTML template from `drawers/language`.
     * 2. Injects the parsed template into the left container (`#left-leaf`).
     * 3. Loads all existing languages from `window.txnmAPI.repositories.language.ReadAll()`.
     * 4. Hydrates the raw data into `Language` instances.
     * 5. Initializes a real-time search filter that dynamically updates the language list.
     * 6. Registers an event listener on the creation button to open the language creation form.
     * 7. Renders the complete list of available languages via `DisplayLanguageThumbnails()`.
     *
     * **Parameters:**
     * None.
     *
     * **Returns:**
     * @returns {Promise<void>} Resolves when the Language Drawer UI and all its event handlers are fully initialized.
     */
    public static async CreateAndHandleLanguageDrawer(): Promise<void> {
        const leftLeaf: HTMLElement = document.getElementById("left-leaf")!;
        const languageDrawer: Element | undefined = await TemplateManager.LoadTemplateAsHTML("drawers/language");
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
                await LanguageUIBuilder.DisplayThumbnails(filteredLanguages);
            })

            const createFormButton: HTMLButtonElement = leftLeaf!.querySelector<HTMLButtonElement>("#create-button")!;
            createFormButton?.addEventListener("click", async (event: Event) => {
                event.preventDefault();
                await LanguageUIBuilder.CreateAndHandleForm();
            })

            await LanguageUIBuilder.DisplayThumbnails(languages);
            console.log("[Renderer] - " + JSON.stringify(languages));
        }
    }

    /**
     * Renders and manages the list of language thumbnails within the Language Drawer UI.
     *
     * Each language is displayed as an interactive thumbnail generated from a predefined HTML template.
     * These thumbnails act as clickable buttons that open the corresponding language edition form
     * within the main interface’s right container (`#right-leaf`).
     *
     * **Overview:**
     * This function rebuilds the language list dynamically each time it is invoked,
     * ensuring the displayed content always reflects the current state of available languages.
     *
     * **Functional Flow:**
     * 1. Selects and clears the language container inside the left panel (`#left-leaf`).
     * 2. Loads the base thumbnail template from `window.txnmAPI.LoadTemplate("thumbnails/language")`.
     * 3. Iterates over each provided `Language` instance.
     * 4. For every language:
     *    - Replaces template placeholders (`{{id}}`, `{{name_native}}`, `{{name_local}}`) with actual language data.
     *    - Parses the resulting HTML string into a DOM element.
     *    - Attaches a click event listener to the element’s button, triggering `CreateAndHandleLanguageForm(language)`.
     *    - Appends the finalized thumbnail element to the language container.
     * 5. Logs parsing or rendering errors to the console without halting execution.
     *
     * **Parameters:**
     * @param {Language[]} languages - An array of `Language` instances to be rendered as thumbnails.
     *
     * **Returns:**
     * @returns {Promise<void>} Resolves when all language thumbnails have been successfully rendered and event listeners registered.
     */
    public static async DisplayThumbnails(languages: Language[]): Promise<void> {
        const leftLeaf: HTMLElement = document.getElementById("left-leaf")!;
        const languageContainer: HTMLElement = leftLeaf.querySelector("#language-container")!;
        languageContainer.replaceChildren();

        const languageThumbnail: string | undefined = await window.txnmAPI.LoadTemplateAsString("thumbnails/language");

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
                    await LanguageUIBuilder.CreateAndHandleForm(language);
                    await LanguageUIBuilder.CreateAndHandleDeleteButton(language);
                })

                return languageContainer.append(thumbnailElement);
            } catch (error) {
                console.error("An error happened trying to parse HTML from the provided template. \n", error);
                return undefined;
            }
        })
    }

    /**
     * Initializes and manages the **Language Form** UI within the main interface.
     *
     * This asynchronous function renders the language creation or edition form inside the right container (`#right-leaf`),
     * binds input fields and event handlers, and handles form submission logic to create or update a `Language` record.
     *
     * **Overview:**
     * The Language Form can operate in two modes:
     * - **Creation Mode:** When no `language` argument is provided, the form is rendered empty for new language entry.
     * - **Edition Mode:** When a `Language` instance is provided, form fields are pre-filled for editing the existing record.
     *
     * **Functional Flow:**
     * 1. Fetches and parses the language form HTML template (`forms/language`).
     * 2. Injects the parsed template into the right container (`#right-leaf`), replacing existing content.
     * 3. Selects all input fields (ISO codes, native/local names, direction, etc.).
     * 4. If a `language` instance is passed, populates the input fields with its data.
     * 5. Attaches an event listener to the **Submit** button that:
     *    - Validates required inputs (`name_native`, `name_local`).
     *    - Constructs a new `Language` instance from the form data.
     *    - Sends the instance to the repository API:
     *        - `Create()` if the language is new (`id == 0`).
     *        - `Update()` if it already exists.
     *    - On success, refreshes the Language Drawer (`CreateAndHandleLanguageDrawer()`),
     *      reapplies the active search filter, re-renders the filtered list of languages,
     *      and reopens the form for continued editing.
     *
     * **Parameters:**
     * @param {Language} [language] - Optional `Language` instance to pre-fill the form for edition mode.
     *
     * **Returns:**
     * @returns {Promise<void>} Resolves once the form has been rendered, initialized, and submission handlers attached.
     */
    public static async CreateAndHandleForm(language?: Language): Promise<void> {
        const leftLeaf: HTMLElement = document.getElementById("left-leaf")!;
        const rightLeaf: HTMLElement = document.getElementById("right-leaf")!;
        const languageCreationForm: Element | undefined = await TemplateManager.LoadTemplateAsHTML("forms/language");
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
                    await LanguageUIBuilder.CreateAndHandleLanguageDrawer();
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
                    await LanguageUIBuilder.DisplayThumbnails(filteredLanguages);
                    await LanguageUIBuilder.CreateAndHandleForm(language ? language : undefined);
                }
            })
        }
    }

    /**
     * Creates and manages the **Delete Button** for a specific `Language` in the interface.
     *
     * This asynchronous function generates a delete button for the given `Language`, injects it into the
     * right container (`#right-leaf`), and attaches the click event listener that handles deletion and UI updates.
     *
     * **Functional Flow:**
     * 1. Fetches and parses the delete button template (`buttons/delete`) as a string.
     * 2. Replaces the `{id}` placeholder in the template with the language's ID.
     * 3. Converts the template string into a DOM element and appends it to the right container (`#right-leaf`).
     * 4. Attaches a click event listener that:
     *    - Calls `window.txnmAPI.repositories.language.Delete(language)` to remove the language.
     *    - If deletion succeeds:
     *        - Saves the current search query from `#searchbar`.
     *        - Refreshes the Language Drawer (`CreateAndHandleLanguageDrawer()`).
     *        - Reapplies the previous search query.
     *        - Filters all languages based on ISO codes, native name, or local name.
     *        - Renders the filtered languages as thumbnails (`DisplayLanguageThumbnails()`).
     *        - Clears the right container (`#right-leaf`) to remove the button.
     *
     * **Parameters:**
     * @param {Language} language - The `Language` instance for which the delete button is created.
     *
     * **Returns:**
     * @returns {Promise<void>} Resolves once the delete button has been created, the event listener attached, and the UI has been updated after a deletion event.
     */
    public static async CreateAndHandleDeleteButton(language: Language): Promise<void> {
        const leftLeaf: HTMLElement = document.getElementById("left-leaf")!;
        const rightLeaf: HTMLElement = document.getElementById("right-leaf")!;
        let deleteButtonString: string | undefined = await TemplateManager.LoadTemplateAsString("buttons/delete");
        deleteButtonString = deleteButtonString!.replace("{id}", String(language.GetId()));
        const deleteButton: Element | undefined = await TemplateManager.ParseHTMLFromString(deleteButtonString);
        if (deleteButton) {
            deleteButton.addEventListener("click", async (event: Event): Promise<void> => {
                const success: boolean = await window.txnmAPI.repositories.language.Delete(language);
                if (success) {
                    const query: string = leftLeaf.querySelector<HTMLInputElement>("#searchbar")!.value;
                    await LanguageUIBuilder.CreateAndHandleLanguageDrawer();
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
                    await LanguageUIBuilder.DisplayThumbnails(filteredLanguages);
                    rightLeaf.replaceChildren();
                }
            })
            rightLeaf.appendChild(deleteButton);
        }
    }
}