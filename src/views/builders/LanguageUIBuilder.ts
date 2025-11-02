import {Language} from "../../database/models/Language";
import {TemplateManager} from "../../utils/renderer/TemplateManager";

export class LanguageUIBuilder {
    public static async CreateAndHandleDrawer(): Promise<void> {
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

    public static async DisplayThumbnails(languages: Language[]): Promise<void> {
        const leftLeaf: HTMLElement = document.getElementById("left-leaf")!;
        const languageContainer: HTMLElement = leftLeaf.querySelector("#language-container")!;
        languageContainer.replaceChildren();

        const thumbnailTemplate: Element | undefined = await TemplateManager.LoadTemplateAsHTML("thumbnails/language");
        if (!thumbnailTemplate) return;

        languages.forEach((language: Language) => {
            let thumbnail: Element = thumbnailTemplate.cloneNode(true) as Element;
            const thumbnailButton: HTMLButtonElement = thumbnail.querySelector('[data-role="thumbnail-button"]')!;

            thumbnailButton.id = String(language.GetId());
            thumbnailButton.querySelector('[data-role="thumbnail-name_native"]')!.textContent = language.GetNameNative();
            thumbnailButton.querySelector('[data-role="thumbnail-name_local"]')!.textContent = language.GetNameLocal();

            thumbnailButton.addEventListener("click", async (event: Event) => {
                event.preventDefault();
                await LanguageUIBuilder.CreateAndHandleForm(language);
                await LanguageUIBuilder.CreateAndHandleDeleteButton(language);
            });

            languageContainer.append(thumbnail);
        })
    }

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
                    await LanguageUIBuilder.CreateAndHandleDrawer();
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
                    await LanguageUIBuilder.CreateAndHandleDrawer();
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