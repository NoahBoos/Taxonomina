import {Dictionary} from "../database/models/Dictionary";
import {TemplateManager} from "../utils/renderer/TemplateManager";
import {DictionaryService} from "../services/DictionaryService";
import {GetSettings} from "../views/pages/index/renderer";
import {EntryUIBuilder} from "./EntryUIBuilder";
import {GrammaticalCategoryUIBuilder} from "./GrammaticalCategoryUIBuilder";
import {GrammaticalGenreUIBuilder} from "./GrammaticalGenreUIBuilder";
import {LanguageUIBuilder} from "./LanguageUIBuilder";
import {SettingUIBuilder} from "./SettingUIBuilder";

export class DictionaryUIBuilder {
    public static currentDictionary_id: number;
    public static leftLeaf: Element;
    public static rightLeaf: Element;

    public static async Initialize() {
        DictionaryUIBuilder.currentDictionary_id = GetSettings().currentDictionary;
        const currentDictionary: Dictionary = await DictionaryService.GetCurrentDictionary();
        DictionaryUIBuilder.SetDictionaryInformation(currentDictionary);
        DictionaryUIBuilder.leftLeaf = document.querySelector("#left-leaf")!;
        DictionaryUIBuilder.rightLeaf = document.querySelector("#right-leaf")!;

        const dropdownButton: HTMLElement = document.getElementById("dictionary-dropdown-button")!;
        dropdownButton.addEventListener("click", async () => {
            dropdownMenu.classList.toggle("inactive");
        });

        const dropdownMenu: HTMLElement = document.getElementById("dictionary-dropdown-menu")!;
        const dropdownStateObserver = new MutationObserver(async () => {
           if (!dropdownMenu.classList.contains("inactive")) {
               const currentDictionary: Dictionary = await DictionaryService.GetCurrentDictionary();
               let dictionaries: Dictionary[] = await DictionaryService.GetAllDictionariesButOne(currentDictionary);
               await DictionaryUIBuilder.RenderDropdown(dictionaries);
           } else {
               dropdownMenu.replaceChildren();
           }
        });
        dropdownStateObserver.observe(dropdownMenu, { attributes: true, attributeFilter: ["class"] })
    }

    public static async RenderDropdown(dictionaries: Dictionary[]): Promise<void> {
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
                    EntryUIBuilder.isDrawerRevealed = false;
                    GrammaticalCategoryUIBuilder.isDrawerRevealed = false;
                    GrammaticalGenreUIBuilder.isDrawerRevealed = false;
                    LanguageUIBuilder.isDrawerRevealed = false;
                    SettingUIBuilder.isPanelRevealed = false;
                    this.leftLeaf.replaceChildren();
                    this.leftLeaf.classList.add('hidden');
                    this.rightLeaf.replaceChildren();
                    dropdownMenu.classList.toggle("inactive");
                });

                const editButton: HTMLButtonElement = thumbnail.querySelector<HTMLButtonElement>("#edit-button")!;
                editButton.addEventListener("click", async () => {
                    await DictionaryUIBuilder.RenderForm(dictionary);
                });

                const deleteButton: HTMLButtonElement = thumbnail.querySelector<HTMLButtonElement>("#delete-button")!;
                deleteButton.addEventListener("click", async () => {
                    const success: boolean = await DictionaryService.Delete(dictionary);
                    if (success) {
                        DictionaryUIBuilder.rightLeaf.replaceChildren();
                        const dropdownMenu: HTMLElement = document.getElementById("dictionary-dropdown-menu")!;
                        dropdownMenu.replaceChildren();
                        dropdownMenu.classList.toggle("inactive");
                    }
                });

                dropdownMenu.appendChild(thumbnail);
            } catch (error) {
                console.error("An error occurred trying to generate the thumbnails.\n", error);
                return;
            }
        }

        const createDictionaryThumbnail: HTMLLIElement = await TemplateManager.LoadTemplateAsHTML("buttons/dictionary/create") as HTMLLIElement;
        const createDictionaryButton: HTMLButtonElement = createDictionaryThumbnail.querySelector<HTMLButtonElement>("#dictionary-create-form-button")!;
        createDictionaryButton.innerHTML = "Créer un nouveau dictionnaire";
        createDictionaryButton.addEventListener("click", async () => {
            await DictionaryUIBuilder.RenderForm();
        });
        dropdownMenu.appendChild(createDictionaryButton);
    }

    public static async RenderForm(dictionary?: Dictionary): Promise<void> {
        DictionaryUIBuilder.rightLeaf.replaceChildren();
        const form: Element | undefined = await TemplateManager.LoadTemplateAsHTML("forms/dictionary");
        if (!form) return;

        DictionaryUIBuilder.rightLeaf.replaceChildren(form);

        const title: HTMLHeadingElement = form.querySelector<HTMLHeadingElement>('[data-role="form-title"]')!;
        const inputName: HTMLInputElement = DictionaryUIBuilder.rightLeaf.querySelector<HTMLInputElement>("#name")!;
        const inputDescription: HTMLInputElement = DictionaryUIBuilder.rightLeaf.querySelector<HTMLInputElement>("#description")!;
        const inputId: HTMLInputElement = DictionaryUIBuilder.rightLeaf.querySelector<HTMLInputElement>("#id")!;
        const submitButton: HTMLButtonElement = DictionaryUIBuilder.rightLeaf.querySelector<HTMLButtonElement>("#submit")!;

        if (!dictionary) {
            title.textContent = "Création - Dictionnaire";
            submitButton.innerHTML = "Créer";
        } else if (dictionary) {
            title.textContent = "Modification - \"" + dictionary.GetName() + "\"";
            inputName.value = dictionary.GetName();
            inputDescription.value = dictionary.GetDescription();
            inputId.value = String(dictionary.GetId());
            submitButton.innerHTML = "Mettre à jour";
        }

        submitButton.addEventListener("click", async (event: Event) => {
            event.preventDefault();
            let [success, savedDictionary]: [boolean, Dictionary | undefined] = await DictionaryService.ProcessForm(form);
            if (success && savedDictionary) {
                await DictionaryService.SetCurrentDictionary(savedDictionary);
                DictionaryUIBuilder.SetDictionaryInformation(savedDictionary);
                const dictionaries: Dictionary[] = await DictionaryService.GetAllDictionariesButOne(savedDictionary);
                await DictionaryUIBuilder.RenderDropdown(dictionaries);
                await DictionaryUIBuilder.RenderForm(savedDictionary ? savedDictionary : undefined);
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