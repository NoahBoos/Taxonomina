import {GrammaticalCategory} from "../database/models/GrammaticalCategory";
import {TemplateManager} from "../utils/renderer/TemplateManager";
import {GrammaticalCategoryService} from "../services/GrammaticalCategoryService";
import {GrammaticalGenreUIBuilder} from "./GrammaticalGenreUIBuilder";
import {LanguageUIBuilder} from "./LanguageUIBuilder";
import {EntryUIBuilder} from "./EntryUIBuilder";
import {SettingUIBuilder} from "./SettingUIBuilder";

export class GrammaticalCategoryUIBuilder {
    public static isDrawerRevealed: boolean = false;
    private static thumbnailTemplate: Element | undefined = undefined;
    private static leftLeaf: Element;
    private static rightLeaf: Element;
    private static drawer: Element;

    public static async Initialize() {
        GrammaticalCategoryUIBuilder.leftLeaf = document.querySelector("#left-leaf")!;
        GrammaticalCategoryUIBuilder.rightLeaf = document.querySelector("#right-leaf")!;

        const button: HTMLButtonElement = document.querySelector<HTMLButtonElement>("#grammatical-category-drawer-button")!;
        button.addEventListener("click", async (event: Event) => {
            event.preventDefault();
            GrammaticalCategoryUIBuilder.isDrawerRevealed = !GrammaticalCategoryUIBuilder.isDrawerRevealed;

            if (GrammaticalCategoryUIBuilder.isDrawerRevealed) {
                EntryUIBuilder.isDrawerRevealed = false;
                GrammaticalGenreUIBuilder.isDrawerRevealed = false;
                LanguageUIBuilder.isDrawerRevealed = false;
                SettingUIBuilder.isDrawerRevealed = false;
                await GrammaticalCategoryUIBuilder.RenderDrawer();
            } else {
                GrammaticalCategoryUIBuilder.leftLeaf.replaceChildren();
                GrammaticalCategoryUIBuilder.leftLeaf.classList.add('hidden');
            }
        });
    }

    public static async RenderDrawer() {
        GrammaticalCategoryUIBuilder.leftLeaf.classList.remove('hidden');
        GrammaticalCategoryUIBuilder.leftLeaf.replaceChildren();
        const drawer: Element | undefined = await TemplateManager.LoadTemplateAsHTML("drawers/grammatical-category");
        const grammaticalCategories: GrammaticalCategory[] = await GrammaticalCategoryService.ReadAll();
        if (!drawer) {
            return;
        } else {
            GrammaticalCategoryUIBuilder.drawer = drawer;
            await GrammaticalCategoryUIBuilder.RenderSearchbar();
            await GrammaticalCategoryUIBuilder.RenderCreateButton();
            await GrammaticalCategoryUIBuilder.RenderList(grammaticalCategories);
            GrammaticalCategoryUIBuilder.leftLeaf.appendChild(GrammaticalCategoryUIBuilder.drawer);
        }
    }

    public static async RenderSearchbar() {
        const searchbar: HTMLInputElement = GrammaticalCategoryUIBuilder.drawer.querySelector<HTMLInputElement>("#searchbar")!;
        searchbar.addEventListener("input", async () => {
           const grammaticalCategories: GrammaticalCategory[] = await GrammaticalCategoryService.FilterBySearch(searchbar.value);
           await GrammaticalCategoryUIBuilder.RenderList(grammaticalCategories);
        });
    }

    public static async RenderList(grammaticalCategories?: GrammaticalCategory[]) {
        const container: Element = GrammaticalCategoryUIBuilder.drawer.querySelector("#grammatical-category-container")!;
        GrammaticalCategoryUIBuilder.thumbnailTemplate = await TemplateManager.LoadTemplateAsHTML("thumbnails/grammatical-category");
        container.replaceChildren();
        if (!grammaticalCategories) grammaticalCategories = await GrammaticalCategoryService.ReadAll();

        grammaticalCategories.forEach(gc => {
            GrammaticalCategoryUIBuilder.RenderThumbnail(container, gc);
        });
    }

    public static async RenderThumbnail(container: Element, grammaticalCategory: GrammaticalCategory) {
        const thumbnail = GrammaticalCategoryUIBuilder.thumbnailTemplate?.cloneNode(true) as Element;
        const button: HTMLButtonElement = thumbnail.querySelector<HTMLButtonElement>("button")!;
        button.innerText = grammaticalCategory.GetName();
        button.addEventListener("click", async (event: Event) => {
            event.preventDefault();
            await GrammaticalCategoryUIBuilder.RenderForm(grammaticalCategory);
        });
        container.appendChild(thumbnail);
    }

    public static async RenderForm(grammaticalCategory?: GrammaticalCategory) {
        GrammaticalCategoryUIBuilder.rightLeaf.replaceChildren();
        const form: Element | undefined = await TemplateManager.LoadTemplateAsHTML("forms/grammatical-category");
        if (!form) return;

        const title: HTMLHeadingElement = form.querySelector<HTMLHeadingElement>('[data-role="form-title"]')!;
        const inputName: HTMLInputElement = form.querySelector<HTMLInputElement>("#name")!;
        const inputId: HTMLInputElement = form.querySelector<HTMLInputElement>("#id")!;
        const submitButton: HTMLButtonElement = form.querySelector<HTMLButtonElement>("button")!;

        if (!grammaticalCategory) {
            title.textContent = "Création - Catégorie grammaticale";
            submitButton.innerText = "Créer";
        } else {
            title.textContent = "Modification - " + grammaticalCategory.GetName();
            inputName.value = grammaticalCategory.GetName();
            inputId.value = String(grammaticalCategory.GetId());
            submitButton.innerText = "Mettre à jour";
        }

        submitButton.addEventListener("click", async (event: Event) => {
            event.preventDefault();
            let [success, savedGrammaticalCategory]: [boolean, GrammaticalCategory | undefined] = await GrammaticalCategoryService.ProcessForm(form);
            if (success && savedGrammaticalCategory) {
                const query: string = GrammaticalCategoryUIBuilder.drawer.querySelector<HTMLInputElement>("#searchbar")!.value;
                const grammaticalCategories: GrammaticalCategory[] = await GrammaticalCategoryService.FilterBySearch(query);
                await GrammaticalCategoryUIBuilder.RenderList(grammaticalCategories ? grammaticalCategories : undefined);
                await GrammaticalCategoryUIBuilder.RenderForm(savedGrammaticalCategory ? savedGrammaticalCategory : undefined);
            }
        });

        GrammaticalCategoryUIBuilder.rightLeaf.appendChild(form);
        if (grammaticalCategory) await GrammaticalCategoryUIBuilder.RenderDeleteButton(grammaticalCategory);
    }

    public static async RenderCreateButton() {
        const button: HTMLButtonElement = GrammaticalCategoryUIBuilder.drawer.querySelector<HTMLButtonElement>("#create-button")!;
        button.addEventListener("click", async (event: Event) => {
            event.preventDefault();
            GrammaticalCategoryUIBuilder.rightLeaf.replaceChildren();
            await GrammaticalCategoryUIBuilder.RenderForm();
        });
    }

    public static async RenderDeleteButton(grammaticalCategory: GrammaticalCategory) {
        const button: Element | undefined = await TemplateManager.LoadTemplateAsHTML("buttons/delete");
        if (!button) return;
        button.addEventListener("click", async (event: Event) => {
            event.preventDefault();
            const success: boolean = await GrammaticalCategoryService.Delete(grammaticalCategory);
            if (success) {
                GrammaticalCategoryUIBuilder.rightLeaf.replaceChildren();
                const query: string = GrammaticalCategoryUIBuilder.drawer.querySelector<HTMLInputElement>("#searchbar")!.value;
                const grammaticalCategories: GrammaticalCategory[] = await GrammaticalCategoryService.FilterBySearch(query);
                await GrammaticalCategoryUIBuilder.RenderList(grammaticalCategories ? grammaticalCategories : undefined);
            }
        });
        GrammaticalCategoryUIBuilder.rightLeaf.appendChild(button);
    }
}