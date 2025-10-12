import {Dictionary} from "../../database/models/Dictionary";
import {TemplateManager} from "../../utils/renderer/TemplateManager";
import {DictionaryService} from "../../utils/renderer/services/DictionaryService";

export class DictionaryUIBuilder {
    public static async InitializeDictionarySection() {
        const currentDictionary: Dictionary = await DictionaryService.GetCurrentDictionary();
        DictionaryUIBuilder.SetDictionaryInformation(currentDictionary);

        const dropdownButton: HTMLElement = document.getElementById("dictionary-dropdown-button")!;
        dropdownButton.addEventListener("click", async () => {
            dropdownMenu.classList.toggle("inactive");
        });

        const dropdownMenu: HTMLElement = document.getElementById("dictionary-dropdown-menu")!;
        const dropdownStateObserver = new MutationObserver(async () => {
           if (!dropdownMenu.classList.contains("inactive")) {
               console.log(`La classe inactive vient d'être retirée.`);
               const currentDictionary: Dictionary = await DictionaryService.GetCurrentDictionary();
               let dictionaries: Dictionary[] = await DictionaryService.GetAllDictionariesButOne(currentDictionary);
               await DictionaryUIBuilder.InitializeDropdown(dictionaries);
           } else {
               console.log(`La classe inactive vient d'être ajoutée.`);
               dropdownMenu.replaceChildren();
           }
        });

        dropdownStateObserver.observe(dropdownMenu, { attributes: true, attributeFilter: ["class"] })
    }

    public static async InitializeDropdown(dictionaries: Dictionary[]): Promise<void> {
        const dropdownMenu: HTMLElement = document.getElementById("dictionary-dropdown-menu")!;
        dropdownMenu.replaceChildren();
        const dictionaryThumbnailTemplate: Element | undefined = await TemplateManager.LoadTemplateAsHTML("thumbnails/dictionary");
        if (!dictionaryThumbnailTemplate) return;

        for (const dictionary of dictionaries) {
            const thumbnail: Element = dictionaryThumbnailTemplate!.cloneNode(true) as Element;

            try {
                const switchButton: HTMLButtonElement = thumbnail.querySelector<HTMLButtonElement>("#switch-button")!;
                switchButton.innerHTML = dictionary.GetName();
                switchButton.addEventListener("click", async () => {
                    await DictionaryService.SetCurrentDictionary(dictionary);
                    DictionaryUIBuilder.SetDictionaryInformation(dictionary);
                    await DictionaryUIBuilder.InitializeDropdown(dictionaries);
                });

                const editButton: HTMLButtonElement = thumbnail.querySelector<HTMLButtonElement>("#edit-button")!;
                editButton.addEventListener("click", async () => {
                    await DictionaryUIBuilder.CreateAndHandleForm(dictionary);
                });

                const deleteButton: HTMLButtonElement = thumbnail.querySelector<HTMLButtonElement>("#delete-button")!;
                deleteButton.addEventListener("click", async () => {
                    const rightLeaf: HTMLElement = document.getElementById("right-leaf")!;
                    const success: boolean = await DictionaryService.Delete(dictionary);
                    if (success) {
                        rightLeaf.replaceChildren();
                        const dropdownMenu: HTMLElement = document.getElementById("dictionary-dropdown-menu")!;
                        dropdownMenu.replaceChildren();
                        dropdownMenu.classList.toggle("inactive");
                    }
                });

                dropdownMenu.appendChild(thumbnail);
            } catch (error) {
                console.error("An error occured trying to generate the thumbnails.\n", error);
                return;
            }
        }

        const createDictionaryThumbnail: HTMLLIElement = await TemplateManager.LoadTemplateAsHTML("buttons/dictionary/create") as HTMLLIElement;
        const createDictionaryButton: HTMLButtonElement = createDictionaryThumbnail.querySelector<HTMLButtonElement>("#dictionary-create-form-button")!;
        createDictionaryButton.innerHTML = "Créer un nouveau dictionnaire";
        createDictionaryButton.addEventListener("click", async () => {
            await DictionaryUIBuilder.CreateAndHandleForm();
        });
        dropdownMenu.appendChild(createDictionaryButton);
    }

    public static async CreateAndHandleForm(dictionary?: Dictionary): Promise<void> {
        const rightLeaf: HTMLElement = document.getElementById("right-leaf")!;
        rightLeaf.replaceChildren();
        const form: Element | undefined = await TemplateManager.LoadTemplateAsHTML("forms/dictionary");
        if (!form) return;

        rightLeaf.replaceChildren(form);

        const inputName: HTMLInputElement = rightLeaf.querySelector<HTMLInputElement>("#name")!;
        const inputDescription: HTMLInputElement = rightLeaf.querySelector<HTMLInputElement>("#description")!;
        const inputId: HTMLInputElement = rightLeaf.querySelector<HTMLInputElement>("#id")!;
        const submitButton: HTMLButtonElement = rightLeaf.querySelector<HTMLButtonElement>("#submit")!;

        if (!dictionary) {
            submitButton.innerHTML = "Create dictionary";
        } else if (dictionary) {
            inputName.value = dictionary.GetName();
            inputDescription.value = dictionary.GetDescription();
            inputId.value = String(dictionary.GetId());
            submitButton.innerHTML = "Update dictionary";
        }

        submitButton.addEventListener("click", async () => {
            let dictionary: Dictionary = new Dictionary(parseInt(inputId.value), inputName.value, inputDescription.value);
            let success: boolean = await DictionaryService.Save(dictionary);
            if (success) {
                await DictionaryUIBuilder.CreateAndHandleForm(dictionary ? dictionary : undefined);
            }
        });
    }

    private static SetDictionaryInformation(dictionary: Dictionary) {
        const titleParagraph: HTMLSpanElement = document.querySelector<HTMLSpanElement>("#dictionary-title")!;
        titleParagraph.innerHTML = dictionary.GetName();
        const descriptionParagraph: HTMLParagraphElement = document.querySelector<HTMLParagraphElement>("#dictionary-description")!;
        descriptionParagraph.innerHTML = dictionary.GetDescription();
    }
}