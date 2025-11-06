import {TemplateManager} from "../../utils/renderer/TemplateManager";
import {Entry} from "../../database/models/Entry";
import {EntryService} from "../../utils/renderer/services/EntryService";
import {GrammaticalCategory} from "../../database/models/GrammaticalCategory";
import {GrammaticalCategoryService} from "../../utils/renderer/services/GrammaticalCategoryService";
import {Language} from "../../database/models/Language";
import {LanguageService} from "../../utils/renderer/services/LanguageService";
import {GrammaticalGenre} from "../../database/models/GrammaticalGenre";
import {GrammaticalGenreService} from "../../utils/renderer/services/GrammaticalGenreService";
import {Definition} from "../../database/models/Definition";
import {DefinitionService} from "../../utils/renderer/services/DefinitionService";
import {GrammaticalCategoryUIBuilder} from "./GrammaticalCategoryUIBuilder";
import {GrammaticalGenreUIBuilder} from "./GrammaticalGenreUIBuilder";
import {LanguageUIBuilder} from "./LanguageUIBuilder";

export class EntryUIBuilder {
    public static isDrawerRevealed: boolean = false;
    public static tagTemplate: HTMLTemplateElement;
    private static leftLeaf: Element;
    private static rightLeaf: Element;

    public static async Initialize() {
        this.leftLeaf = document.querySelector("#left-leaf")!;
        this.rightLeaf = document.querySelector("#right-leaf")!;
        const drawerButton: HTMLButtonElement = document.querySelector<HTMLButtonElement>("#entry-drawer-button")!;
        drawerButton.addEventListener("click", async () => {
            EntryUIBuilder.isDrawerRevealed = !EntryUIBuilder.isDrawerRevealed;

            if (EntryUIBuilder.isDrawerRevealed) {
                GrammaticalCategoryUIBuilder.isDrawerRevealed = false;
                GrammaticalGenreUIBuilder.isDrawerRevealed = false;
                LanguageUIBuilder.isDrawerRevealed = false;
                await EntryUIBuilder.Drawer();
            } else {
                this.leftLeaf.replaceChildren();
                this.leftLeaf.classList.add('hidden');
            }
        });
    }

    public static async Drawer() {
        this.leftLeaf.classList.remove('hidden');
        this.leftLeaf.replaceChildren();
        const drawer: Element | undefined = await TemplateManager.LoadTemplateAsHTML("drawers/entry");
        const entries: Entry[] = await EntryService.ReadAll();
        if (!drawer) {
            return;
        } else {
            await EntryUIBuilder.Searchbar(drawer);
            await EntryUIBuilder.CreateButton(drawer);
            await EntryUIBuilder.List(drawer, entries);
            this.leftLeaf.appendChild(drawer);
        }
    }

    public static async Searchbar(drawer: Element) {
        const searchbar: HTMLInputElement = drawer.querySelector<HTMLInputElement>("#searchbar")!;
        searchbar.addEventListener("input", async () => {
           const query: string = searchbar.value.toLowerCase();
           await EntryUIBuilder.UpdateSearchbar(drawer, query);
        });
    }

    public static async UpdateSearchbar(drawer: Element, query: string) {
        const entries: Entry[] = await EntryService.ReadAll();
        const filteredEntries: Entry[] = entries.filter((entry: Entry) => {
            return [entry.GetLemma()].some(value => value.toLowerCase().includes(query));
        });
        await EntryUIBuilder.List(drawer, filteredEntries);
    }

    public static async List(drawer: Element, entries?: Entry[]) {
        const container: Element = drawer.querySelector("#entry-container")!;
        const thumbnailTemplate: Element | undefined = await TemplateManager.LoadTemplateAsHTML("thumbnails/entry");
        if (!thumbnailTemplate) return;
        container.replaceChildren();
        if (!entries) entries = await EntryService.ReadAll();

        entries.forEach((entry: Entry) => {
           const thumbnail: Element = thumbnailTemplate.cloneNode(true) as Element;
           const thumbnailButton: HTMLButtonElement = thumbnail.querySelector<HTMLButtonElement>("button")!;
           thumbnailButton.id = String(entry.GetId());
           thumbnailButton.innerText = entry.GetLemma();
           thumbnailButton.addEventListener("click", async () => {
               this.rightLeaf.replaceChildren();
              await EntryUIBuilder.Form(drawer, entry);
           });
           container.appendChild(thumbnail);
        });
    }

    public static async View(drawer: Element, entry: Entry) {

    }

    public static async Form(drawer: Element, entry?: Entry) {
        this.rightLeaf.replaceChildren();
        const form: Element | undefined = await TemplateManager.LoadTemplateAsHTML("forms/entry");
        if (!form) return;
        EntryUIBuilder.tagTemplate = form.querySelector<HTMLTemplateElement>("template#gts-tag-template")!;

        const inputLemma: HTMLInputElement = form.querySelector<HTMLInputElement>("#lemma")!;
        const inputEntryId: HTMLInputElement = form.querySelector<HTMLInputElement>("input#entry_id")!;
        const submitButton: HTMLButtonElement = form.querySelector<HTMLButtonElement>("#submit")!;

        await EntryUIBuilder.GenerateLanguageOptions(form, entry);
        await EntryUIBuilder.GenerateGrammaticalCategoryCheckboxes(form, entry);
        await EntryUIBuilder.GenerateGrammaticalGenreCheckboxes(form, entry);
        await EntryUIBuilder.GlobalTranslationFieldset(form, entry);
        await EntryUIBuilder.DefinitionFieldset(form, entry);

        if (!entry) {
            submitButton.innerText = "Créer une entrée";
        } else {
            inputLemma.value = entry.GetLemma();
            inputEntryId.value = String(entry.GetId());
            submitButton.innerText = "Mettre à jour l'entrée";
        }

        submitButton.addEventListener("click", async (event: Event) => {
            event.preventDefault();
            const query: string = drawer.querySelector<HTMLInputElement>("input#searchbar")!.value;
            const savedEntry: Entry | undefined = await EntryService.ProcessForm(form);
            await EntryUIBuilder.UpdateSearchbar(drawer, query);
            await EntryUIBuilder.Form(drawer, savedEntry ? savedEntry : undefined);
        });

        this.rightLeaf.appendChild(form);
        if (entry) await EntryUIBuilder.DeleteButton(drawer, entry);
    }

    public static async GenerateLanguageOptions(form: Element, entry?: Entry) {
        const selectLanguage: HTMLSelectElement = form.querySelector<HTMLSelectElement>("select#language")!;
        const optionLanguageTemplate: HTMLTemplateElement = selectLanguage.querySelector<HTMLTemplateElement>("template")!;

        for (const language of await LanguageService.ReadAll()) {
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

        for (const gramCat of await GrammaticalCategoryService.ReadAll()) {
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

        for (const gramGenre of await GrammaticalGenreService.ReadAll()) {
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
        const entries: Entry[] = await EntryService.ReadAll();
        const translations: Entry[] = entry ? await EntryService.ReadAllByGlobalTranslation(entry) : [];
        const fieldset: HTMLDivElement = form.querySelector<HTMLDivElement>("div#global-translations-section")!;
        const searchbar: HTMLInputElement = fieldset.querySelector<HTMLInputElement>("#gts-searchbar")!;
        const dropdown: HTMLDivElement = fieldset.querySelector<HTMLDivElement>("#gts-dropdown")!;
        const container: HTMLDivElement = fieldset.querySelector<HTMLDivElement>("#gts-translation-items")!;

        dropdown.classList.add("inactive");

        searchbar.addEventListener("input", async () => {
            EntryUIBuilder.TranslationSearchbarBehaviour(searchbar, dropdown, container, entries, translations, entry);
        });

        for (const translation of translations) {
            await EntryUIBuilder.GenerateTranslationTag(container, EntryUIBuilder.tagTemplate, translation);
        }
    }

    public static async DefinitionFieldset(form: Element, entry?: Entry) {
        const entries: Entry[] = await EntryService.ReadAll();
        const definitions: Definition[] = entry ? await DefinitionService.ReadAllByEntry(entry) : [];
        const fieldset: HTMLDivElement = form.querySelector<HTMLDivElement>("div#definitions-section")!;
        const addDefinitionButton: HTMLButtonElement = fieldset.querySelector("#ds-add-button")!;
        const container: HTMLDivElement = fieldset.querySelector<HTMLDivElement>("#ds-definition-items")!;
        const template: HTMLTemplateElement = fieldset.querySelector("#ds-definition-template")!;

        addDefinitionButton.addEventListener("click", async (event) => {
            event.preventDefault();
            await EntryUIBuilder.GenerateDefinition(container, template, entries, [], entry);
        });

        for (const definition of definitions) {
            let translations: Entry[] = await EntryService.ReadAllByLocalTranslation(definition);
            translations = translations.filter(translation => translation.GetId() !== entry?.GetId());
            await EntryUIBuilder.GenerateDefinition(container, template, entries, translations, entry, definition);
        }
    }

    public static async GenerateDefinition(parent: Element, template: HTMLTemplateElement, entries: Entry[], translations: Entry[], entry?: Entry, definition?: Definition) {
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
            EntryUIBuilder.TranslationSearchbarBehaviour(searchbar, dropdown, container, entries, translations, entry);
        });

        for (const translation of translations) {
            await EntryUIBuilder.GenerateTranslationTag(container, EntryUIBuilder.tagTemplate, translation);
        }

        parent.appendChild(definitionElement);
    }

    public static TranslationSearchbarBehaviour(searchbar: HTMLInputElement, dropdown: HTMLDivElement, translationTagContainer: HTMLDivElement, entries: Entry[], translations: Entry[], entry?: Entry) {
        if (searchbar.value === "") {
            dropdown.innerHTML = ""
            dropdown.classList.add("inactive");
            return;
        }

        const filteredEntries: Entry[] = EntryUIBuilder.FilterAvailableTranslations(searchbar, entries, translations, entry);
        dropdown.innerHTML = '';
        if (filteredEntries.length > 0) {
            dropdown.classList.remove("inactive");
            for (const filteredEntry of filteredEntries) {
                EntryUIBuilder.AddTranslationButton(dropdown, translationTagContainer, searchbar, filteredEntry);
            }
        }
    }

    public static FilterAvailableTranslations(searchbar: HTMLInputElement, entries: Entry[], translations: Entry[], entry?: Entry) {
        const query = searchbar.value.toLowerCase();
        return entries.filter(loopedEntry => {
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

    public static AddTranslationButton(parent: Element, translationTagContainer: Element, searchbar: HTMLInputElement, entry: Entry) {
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

    public static async CreateButton(drawer: Element) {
        const button: HTMLButtonElement = drawer.querySelector<HTMLButtonElement>("#create-button")!;
        button.addEventListener("click", async () => {
            this.rightLeaf.replaceChildren();
            await EntryUIBuilder.Form(drawer);
        });
    }

    public static async DeleteButton(drawer: Element, entry: Entry) {
        const button: Element | undefined = await TemplateManager.LoadTemplateAsHTML("buttons/delete");
        if (!button) return;
        button.id = String(entry.GetId());
        button.addEventListener("click", async () => {
            const success: boolean = await EntryService.Delete(entry);
            if (success) {
                this.rightLeaf.replaceChildren();
                const query: string = drawer.querySelector<HTMLInputElement>("#searchbar")!.value.toLowerCase();
                await EntryUIBuilder.UpdateSearchbar(drawer, query);
            }
        });
        this.rightLeaf.appendChild(button);
    }
}