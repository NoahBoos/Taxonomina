import {TemplateManager} from "../utils/renderer/TemplateManager";
import {Entry} from "../database/models/Entry";
import {EntryService} from "../services/EntryService";
import {GrammaticalCategory} from "../database/models/GrammaticalCategory";
import {GrammaticalCategoryService} from "../services/GrammaticalCategoryService";
import {Language} from "../database/models/Language";
import {LanguageService} from "../services/LanguageService";
import {GrammaticalGenre} from "../database/models/GrammaticalGenre";
import {GrammaticalGenreService} from "../services/GrammaticalGenreService";
import {Definition} from "../database/models/Definition";
import {DefinitionService} from "../services/DefinitionService";
import {GrammaticalCategoryUIBuilder} from "./GrammaticalCategoryUIBuilder";
import {GrammaticalGenreUIBuilder} from "./GrammaticalGenreUIBuilder";
import {LanguageUIBuilder} from "./LanguageUIBuilder";
import {SettingUIBuilder} from "./SettingUIBuilder";
import {TaxonominaSettings} from "../interfaces/I_TaxonominaSettings";
import {GetSettings} from "../views/pages/index/renderer";

export class EntryUIBuilder {
    public static isDrawerRevealed: boolean = false;
    private static thumbnailTemplate: Element | undefined = undefined;
    private static tagTemplate: HTMLTemplateElement;
    private static leftLeaf: Element;
    private static rightLeaf: Element;
    private static drawer: Element;
    private static entries: Entry[] = [];

    public static async Initialize() {
        EntryUIBuilder.leftLeaf = document.querySelector("#left-leaf")!;
        EntryUIBuilder.rightLeaf = document.querySelector("#right-leaf")!;
        const button: HTMLButtonElement = document.querySelector<HTMLButtonElement>("#entry-drawer-button")!;
        button.addEventListener("click", async (event: Event) => {
            event.preventDefault();
            EntryUIBuilder.isDrawerRevealed = !EntryUIBuilder.isDrawerRevealed;

            if (EntryUIBuilder.isDrawerRevealed) {
                GrammaticalCategoryUIBuilder.isDrawerRevealed = false;
                GrammaticalGenreUIBuilder.isDrawerRevealed = false;
                LanguageUIBuilder.isDrawerRevealed = false;
                SettingUIBuilder.isPanelRevealed = false;
                await EntryUIBuilder.RenderDrawer();
            } else {
                EntryUIBuilder.leftLeaf.replaceChildren();
                EntryUIBuilder.leftLeaf.classList.add('hidden');
            }
        });
    }

    public static async RenderDrawer() {
        EntryUIBuilder.leftLeaf.classList.remove('hidden');
        EntryUIBuilder.leftLeaf.replaceChildren();
        const drawer: Element | undefined = await TemplateManager.LoadTemplateAsHTML("drawers/entry");
        EntryUIBuilder.entries = await EntryService.ReadAll(GetSettings().currentDictionary);
        if (!drawer) {
            return;
        } else {
            EntryUIBuilder.drawer = drawer;
            await EntryUIBuilder.RenderSearchbar();
            await EntryUIBuilder.RenderCreateButton();
            await EntryUIBuilder.RenderList();
            EntryUIBuilder.leftLeaf.appendChild(EntryUIBuilder.drawer);
        }
    }

    public static async RenderSearchbar() {
        const searchbar: HTMLInputElement = EntryUIBuilder.drawer.querySelector<HTMLInputElement>("#searchbar")!;
        searchbar.addEventListener("input", async () => {
            EntryUIBuilder.entries = await EntryService.FilterBySearch(GetSettings().currentDictionary, searchbar.value);
           await EntryUIBuilder.RenderList();
        });
    }

    public static async RenderList() {
        const container: Element = EntryUIBuilder.drawer.querySelector("#entry-container")!;
        EntryUIBuilder.thumbnailTemplate = await TemplateManager.LoadTemplateAsHTML("thumbnails/entry");
        container.replaceChildren();
        if (!EntryUIBuilder.entries) EntryUIBuilder.entries = await EntryService.ReadAll(GetSettings().currentDictionary);

        EntryUIBuilder.entries.forEach((entry: Entry) => {
            EntryUIBuilder.RenderThumbnail(container, entry);
        });
    }

    public static async RenderThumbnail(container: Element, entry: Entry) {
        const thumbnail = EntryUIBuilder.thumbnailTemplate?.cloneNode(true) as Element;
        const button: HTMLButtonElement = thumbnail.querySelector<HTMLButtonElement>("button")!;
        button.innerText = entry.GetLemma();
        button.addEventListener("click", async (event: Event) => {
            event.preventDefault();
            await EntryUIBuilder.RenderForm(entry);
        });
        container.appendChild(thumbnail);
    }

    public static async RenderView(entry: Entry) {

    }

    public static async RenderForm(entry?: Entry) {
        EntryUIBuilder.rightLeaf.replaceChildren();
        const form: Element | undefined = await TemplateManager.LoadTemplateAsHTML("forms/entry");
        if (!form) return;
        EntryUIBuilder.tagTemplate = form.querySelector<HTMLTemplateElement>("template#gts-tag-template")!;

        const title: HTMLHeadingElement = form.querySelector<HTMLHeadingElement>('[data-role="form-title"]')!;
        const inputLemma: HTMLInputElement = form.querySelector<HTMLInputElement>("#lemma")!;
        const inputEntryId: HTMLInputElement = form.querySelector<HTMLInputElement>("input#entry_id")!;
        const submitButton: HTMLButtonElement = form.querySelector<HTMLButtonElement>("#submit")!;

        await EntryUIBuilder.GenerateLanguageOptions(form, entry);
        await EntryUIBuilder.GenerateGrammaticalCategoryCheckboxes(form, entry);
        await EntryUIBuilder.GenerateGrammaticalGenreCheckboxes(form, entry);
        await EntryUIBuilder.GlobalTranslationFieldset(form, entry);
        await EntryUIBuilder.RenderDefinitionFieldset(form, entry);

        if (!entry) {
            title.textContent = "Création - Entrée";
            submitButton.innerText = "Créer";
        } else {
            title.textContent = "Modification - \"" + entry.GetLemma() + "\"";
            inputLemma.value = entry.GetLemma();
            inputEntryId.value = String(entry.GetId());
            submitButton.innerText = "Mettre à jour";
        }

        submitButton.addEventListener("click", async (event: Event) => {
            event.preventDefault();
            const query: string = EntryUIBuilder.drawer.querySelector<HTMLInputElement>("input#searchbar")!.value;
            const savedEntry: Entry | undefined = await EntryService.ProcessForm(form);
            EntryUIBuilder.entries = await EntryService.FilterBySearch(GetSettings().currentDictionary, query);
            await EntryUIBuilder.RenderList();
            await EntryUIBuilder.RenderForm(savedEntry ? savedEntry : undefined);
        });

        EntryUIBuilder.rightLeaf.appendChild(form);
        if (entry) await EntryUIBuilder.RenderDeleteButton(entry);
    }

    public static async GenerateLanguageOptions(form: Element, entry?: Entry) {
        const selectLanguage: HTMLSelectElement = form.querySelector<HTMLSelectElement>("select#language")!;
        const optionLanguageTemplate: HTMLTemplateElement = selectLanguage.querySelector<HTMLTemplateElement>("template")!;

        for (const language of await LanguageService.ReadAll(GetSettings().currentDictionary)) {
            const option: HTMLOptionElement = optionLanguageTemplate.content.firstElementChild!.cloneNode(true) as HTMLOptionElement;
            option.value = String(language.GetId());
            option.text = language.GetNameLocal();
            option.selected = entry?.GetLanguageId() === language.GetId();
            selectLanguage.appendChild(option);
        }
    }

    public static async GenerateGrammaticalCategoryCheckboxes(form: Element, entry?: Entry) {
        const entryGramCats: GrammaticalCategory[] = entry ? await GrammaticalCategoryService.ReadAllByEntry(entry) : [];
        const fieldsetGramCats: HTMLDivElement = form.querySelector<HTMLDivElement>("div#grammatical-categories")!;
        const container: HTMLDivElement = fieldsetGramCats.querySelector<HTMLDivElement>("#grammatical-category-checkboxes")!;
        const checkboxGramCatTemplate: HTMLTemplateElement = fieldsetGramCats.querySelector<HTMLTemplateElement>("template")!;

        for (const gramCat of await GrammaticalCategoryService.ReadAll(GetSettings().currentDictionary)) {
            const checkbox = checkboxGramCatTemplate.content.firstElementChild!.cloneNode(true) as Element;
            const label: HTMLLabelElement = checkbox.querySelector("label")!;
            const input: HTMLInputElement = checkbox.querySelector("input")!;
            input.value = String(gramCat.GetId());
            input.checked = entryGramCats.some(gc => gc.GetId() === gramCat.GetId());
            label.textContent = gramCat.GetName();
            container.appendChild(checkbox);
        }
    }

    public static async GenerateGrammaticalGenreCheckboxes(form: Element, entry?: Entry) {
        const entryGenres: GrammaticalGenre[] = entry ? await GrammaticalGenreService.ReadAllByEntry(entry) : [];
        const fieldsetGenres: HTMLDivElement = form.querySelector<HTMLDivElement>("div#grammatical-genres")!;
        const container: HTMLDivElement = fieldsetGenres.querySelector<HTMLDivElement>("#grammatical-genre-checkboxes")!;
        const checkboxGenreTemplate: HTMLTemplateElement = fieldsetGenres.querySelector<HTMLTemplateElement>("template")!;

        for (const gramGenre of await GrammaticalGenreService.ReadAll(GetSettings().currentDictionary)) {
            const checkbox = checkboxGenreTemplate.content.firstElementChild!.cloneNode(true) as Element;
            const label: HTMLLabelElement = checkbox.querySelector("label")!;
            const input: HTMLInputElement = checkbox.querySelector("input")!;
            input.value = String(gramGenre.GetId());
            input.checked = entryGenres.some(gg => gg.GetId() === gramGenre.GetId());
            label.textContent = gramGenre.GetName();
            container.appendChild(checkbox);
        }
    }

    public static async GlobalTranslationFieldset(form: Element, entry?: Entry) {
        EntryUIBuilder.entries = await EntryService.ReadAll(GetSettings().currentDictionary);
        const translations: Entry[] = entry ? await EntryService.ReadAllByGlobalTranslation(entry) : [];
        const fieldset: HTMLDivElement = form.querySelector<HTMLDivElement>("div#global-translations-section")!;
        const searchbar: HTMLInputElement = fieldset.querySelector<HTMLInputElement>("#gts-searchbar")!;
        const dropdown: HTMLDivElement = fieldset.querySelector<HTMLDivElement>("#gts-dropdown")!;
        const container: HTMLDivElement = fieldset.querySelector<HTMLDivElement>("#gts-translation-items")!;

        dropdown.classList.add("inactive");

        searchbar.addEventListener("input", async () => {
            EntryUIBuilder.TranslationSearchbarBehaviour(searchbar, dropdown, container, translations, entry);
        });

        for (const translation of translations) {
            await EntryUIBuilder.GenerateTranslationTag(container, EntryUIBuilder.tagTemplate, translation);
        }
    }

    public static async RenderDefinitionFieldset(form: Element, entry?: Entry) {
        EntryUIBuilder.entries = await EntryService.ReadAll(GetSettings().currentDictionary);
        const definitions: Definition[] = entry ? await DefinitionService.ReadAllByEntry(entry) : [];
        const fieldset: HTMLDivElement = form.querySelector<HTMLDivElement>("div#definitions-section")!;
        const addDefinitionButton: HTMLButtonElement = fieldset.querySelector("#ds-add-button")!;
        const container: HTMLDivElement = fieldset.querySelector<HTMLDivElement>("#ds-definition-items")!;
        const template: HTMLTemplateElement = fieldset.querySelector("#ds-definition-template")!;

        addDefinitionButton.addEventListener("click", async (event) => {
            event.preventDefault();
            await EntryUIBuilder.GenerateDefinition(container, template, [], entry);
        });

        for (const definition of definitions) {
            let translations: Entry[] = await EntryService.ReadAllByLocalTranslation(definition);
            translations = translations.filter(translation => translation.GetId() !== entry?.GetId());
            await EntryUIBuilder.GenerateDefinition(container, template, translations, entry, definition);
        }
    }

    public static async GenerateDefinition(parent: Element, template: HTMLTemplateElement, translations: Entry[], entry?: Entry, definition?: Definition) {
        const definitionElement = template.content.firstElementChild!.cloneNode(true) as Element;
        const removeButton: HTMLButtonElement = definitionElement.querySelector<HTMLButtonElement>("#d-remove-button")!;
        removeButton.addEventListener("click", async (event) => {
            event.preventDefault();
            definitionElement.remove();
        })
        const textarea: HTMLTextAreaElement = definitionElement.querySelector<HTMLTextAreaElement>("#d-content")!;
        textarea.textContent = definition
            ? definition.GetDefinition()
            : '';
        const searchbar: HTMLInputElement = definitionElement.querySelector<HTMLInputElement>("#d-searchbar")!;
        const dropdown: HTMLDivElement = definitionElement.querySelector<HTMLDivElement>('#d-dropdown')!;
        const container: HTMLDivElement = definitionElement.querySelector<HTMLDivElement>("#d-translation-items")!;
        const definitionIdInput: HTMLInputElement = definitionElement.querySelector<HTMLInputElement>("#definition_id")!;
        if (definition) definitionIdInput.value = String(definition.GetId());

        dropdown.classList.add("inactive");

        searchbar.addEventListener("input", async () => {
            EntryUIBuilder.TranslationSearchbarBehaviour(searchbar, dropdown, container, translations, entry);
        });

        for (const translation of translations) {
            await EntryUIBuilder.GenerateTranslationTag(container, EntryUIBuilder.tagTemplate, translation);
        }

        parent.appendChild(definitionElement);
    }

    public static TranslationSearchbarBehaviour(searchbar: HTMLInputElement, dropdown: HTMLDivElement, translationTagContainer: HTMLDivElement, translations: Entry[], entry?: Entry) {
        if (searchbar.value === "") {
            dropdown.innerHTML = ""
            dropdown.classList.add("inactive");
            return;
        }

        EntryUIBuilder.entries = EntryUIBuilder.FilterAvailableTranslations(searchbar, translations, entry);
        dropdown.innerHTML = '';
        if (EntryUIBuilder.entries.length > 0) {
            dropdown.classList.remove("inactive");
            for (const filteredEntry of EntryUIBuilder.entries) {
                EntryUIBuilder.RenderAddTranslationButton(dropdown, translationTagContainer, searchbar, filteredEntry);
            }
        }
    }

    public static FilterAvailableTranslations(searchbar: HTMLInputElement, translations: Entry[], entry?: Entry) {
        const query = searchbar.value.toLowerCase();
        return EntryUIBuilder.entries.filter(loopedEntry => {
            return [loopedEntry.GetLemma()].some(value => value.toLowerCase().includes(query))
                && !translations.some(translation => translation.GetId() === loopedEntry.GetId())
                && loopedEntry.GetId() != entry?.GetId();
        });
    }

    public static async GenerateTranslationTag(parent: Element, template: HTMLTemplateElement, entry: Entry) {
        const entryLang: Language = await LanguageService.ReadOne(entry.GetLanguageId());
        const tag = template.content.firstElementChild!.cloneNode(true) as Element;
        const tagText: HTMLParagraphElement = tag.querySelector<HTMLParagraphElement>("p")!;
        const translationIdInput: HTMLInputElement = tag.querySelector<HTMLInputElement>("input#translation_id")!;
        translationIdInput.value = String(entry.GetId());
        tagText.id = String(entryLang.GetId());
        tagText.textContent = entryLang.GetIso639_3()
            ? entryLang.GetIso639_3() + " | " + entry.GetLemma()
            : entryLang.GetIso639_1() + " | " + entry.GetLemma();
        const tagDeleteButton: HTMLButtonElement = tag.querySelector<HTMLButtonElement>("button")!;
        tagDeleteButton.addEventListener("click", async (event) => {
            event.preventDefault()
            tag.remove();
        });
        parent.appendChild(tag);
    }

    public static RenderAddTranslationButton(parent: Element, translationTagContainer: Element, searchbar: HTMLInputElement, entry: Entry) {
        const button: HTMLButtonElement = document.createElement("button");
        button.innerText = entry.GetLemma();
        button.classList.add("p-2", "border-2", "rounded-lg");
        button.addEventListener("click", async (event) => {
            event.preventDefault();
            await EntryUIBuilder.GenerateTranslationTag(translationTagContainer, EntryUIBuilder.tagTemplate, entry);
            button.remove();
            if (!parent.hasChildNodes()) {
                parent.classList.add("inactive");
                searchbar.value = '';
            }
        });
        parent.appendChild(button);
    }

    public static async RenderCreateButton() {
        const button: HTMLButtonElement = EntryUIBuilder.drawer.querySelector<HTMLButtonElement>("#create-button")!;
        button.addEventListener("click", async (event: Event) => {
            event.preventDefault();
            EntryUIBuilder.rightLeaf.replaceChildren();
            await EntryUIBuilder.RenderForm();
        });
    }

    public static async RenderDeleteButton(entry: Entry) {
        const button: Element | undefined = await TemplateManager.LoadTemplateAsHTML("buttons/delete");
        if (!button) return;
        button.id = String(entry.GetId());
        button.addEventListener("click", async (event: Event) => {
            event.preventDefault();
            const success: boolean = await EntryService.Delete(entry);
            if (success) {
                EntryUIBuilder.rightLeaf.replaceChildren();
                const query: string = EntryUIBuilder.drawer.querySelector<HTMLInputElement>("#searchbar")!.value.toLowerCase();
                EntryUIBuilder.entries = await EntryService.FilterBySearch(GetSettings().currentDictionary, query);
                await EntryUIBuilder.RenderList();
            }
        });
        EntryUIBuilder.rightLeaf.appendChild(button);
    }
}