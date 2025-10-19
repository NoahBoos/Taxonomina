import {TemplateManager} from "../../utils/renderer/TemplateManager";
import {Entry} from "../../database/models/Entry";
import {EntryService} from "../../utils/renderer/services/EntryService";
import {GrammaticalCategory} from "../../database/models/GrammaticalCategory";
import {GrammaticalCategoryService} from "../../utils/renderer/services/GrammaticalCategoryService";
import {Language} from "../../database/models/Language";
import {LanguageService} from "../../utils/renderer/services/LanguageService";
import {GrammaticalGenre} from "../../database/models/GrammaticalGenre";
import {GrammaticalGenreService} from "../../utils/renderer/services/GrammaticalGenreService";

export class EntryUIBuilder {
    public static isDrawerRevealed: boolean = false;

    public static async Initialize() {
        const drawerButton: HTMLButtonElement = document.querySelector<HTMLButtonElement>("#entry-drawer-button")!;
        drawerButton.addEventListener("click", async () => {
            EntryUIBuilder.isDrawerRevealed = !EntryUIBuilder.isDrawerRevealed;

            if (EntryUIBuilder.isDrawerRevealed) {
                await EntryUIBuilder.Drawer();
            } else {
                const leftLeaf: Element = document.querySelector("#left-leaf")!;
                leftLeaf.replaceChildren();
                const rightLeaf: Element = document.querySelector("#right-leaf")!;
                rightLeaf.replaceChildren();
            }
        });
    }

    public static async Drawer() {
        const leftLeaf: Element = document.querySelector("#left-leaf")!;
        leftLeaf.replaceChildren();
        const drawer: Element | undefined = await TemplateManager.LoadTemplateAsHTML("drawers/entry");
        const entries: Entry[] = await EntryService.ReadAll();
        if (!drawer) {
            return;
        } else {
            await EntryUIBuilder.Searchbar(drawer);
            await EntryUIBuilder.CreateButton(drawer);
            await EntryUIBuilder.List(drawer, entries);
            leftLeaf.appendChild(drawer);
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
        console.log(drawer)
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
              const rightLeaf: Element = document.querySelector("#right-leaf")!;
              rightLeaf.replaceChildren();
              await EntryUIBuilder.Form(drawer, entry);
           });
           container.appendChild(thumbnail);
        });
    }

    public static async View(drawer: Element, entry: Entry) {

    }

    public static async Form(drawer: Element, entry?: Entry) {
        const rightLeaf: Element = document.querySelector("#right-leaf")!;
        const form: Element | undefined = await TemplateManager.LoadTemplateAsHTML("forms/entry");
        if (!form) return;
        const entryGramCats: GrammaticalCategory[] = entry ? await GrammaticalCategoryService.ReadAllByEntry(entry) : [];
        const entryGenres: GrammaticalGenre[] = entry ? await GrammaticalGenreService.ReadAllByEntry(entry) : [];
        const inputLemma: HTMLInputElement = form.querySelector<HTMLInputElement>("#lemma")!;
        const selectLanguage: HTMLSelectElement = form.querySelector<HTMLSelectElement>("select#language")!;
        const optionLanguageTemplate: HTMLTemplateElement = selectLanguage.querySelector<HTMLTemplateElement>("template")!;
        const fieldsetGramCats: HTMLFieldSetElement = form.querySelector<HTMLFieldSetElement>("fieldset#grammatical-categories")!;
        const checkboxGramCatTemplate: HTMLTemplateElement = fieldsetGramCats.querySelector<HTMLTemplateElement>("template")!;
        const fieldsetGenres: HTMLFieldSetElement = form.querySelector<HTMLFieldSetElement>("fieldset#grammatical-genres")!;
        const checkboxGenreTemplate: HTMLTemplateElement = fieldsetGenres.querySelector<HTMLTemplateElement>("template")!;
        const submitButton: HTMLButtonElement = form.querySelector<HTMLButtonElement>("#submit")!;

        for (const language of await LanguageService.ReadAll()) {
            const option: HTMLOptionElement = optionLanguageTemplate.content.firstElementChild!.cloneNode(true) as HTMLOptionElement;
            option.value = String(language.GetId());
            option.text = language.GetNameLocal();
            option.selected = entry?.GetLanguageId() === language.GetId();
            selectLanguage.appendChild(option);
        }

        for (const gramCat of await GrammaticalCategoryService.ReadAll()) {
            const label = checkboxGramCatTemplate.content.firstElementChild!.cloneNode(true) as HTMLLabelElement;
            const input: HTMLInputElement = label.querySelector<HTMLInputElement>("input")!;
            input.value = String(gramCat.GetId());
            input.checked = entryGramCats.some(gc => gc.GetId() === gramCat.GetId());
            label.append(" " + gramCat.GetName());
            fieldsetGramCats.appendChild(label);
        }

        for (const gramGenre of await GrammaticalGenreService.ReadAll()) {
            const label = checkboxGenreTemplate.content.firstElementChild!.cloneNode(true) as HTMLLabelElement;
            const input: HTMLInputElement = label.querySelector<HTMLInputElement>("input")!;
            input.value = String(gramGenre.GetId());
            input.checked = entryGenres.some(gg => gg.GetId() === gramGenre.GetId());
            label.append(" " + gramGenre.GetName());
            fieldsetGenres.appendChild(label);
        }

        if (!entry) {
            submitButton.innerText = "Créer une entrée";
        } else {
            inputLemma.value = entry.GetLemma();
            submitButton.innerText = "Mettre à jour l'entrée";
        }

        submitButton.addEventListener("click", async (event: Event) => {
            event.preventDefault();
        });

        rightLeaf.appendChild(form);
        if (entry) await EntryUIBuilder.DeleteButton(drawer, entry);
    }

    public static async CreateButton(drawer: Element) {
        const button: HTMLButtonElement = drawer.querySelector<HTMLButtonElement>("#create-button")!;
        button.addEventListener("click", async () => {
            const rightLeaf: Element = document.querySelector("#right-leaf")!;
            rightLeaf.replaceChildren();
            await EntryUIBuilder.Form(drawer);
        });
    }

    public static async DeleteButton(drawer: Element, entry: Entry) {
        const rightLeaf: HTMLElement = document.querySelector("#right-leaf")!;
        const button: Element | undefined = await TemplateManager.LoadTemplateAsHTML("buttons/delete");
        if (!button) return;
        button.id = String(entry.GetId());
        button.addEventListener("click", async () => {
            const success: boolean = await EntryService.Delete(entry);
            if (success) {
                rightLeaf.replaceChildren();
                const query: string = drawer.querySelector<HTMLInputElement>("#searchbar")!.value.toLowerCase();
                await EntryUIBuilder.UpdateSearchbar(drawer, query);
            }
        });
        rightLeaf.appendChild(button);
    }
}