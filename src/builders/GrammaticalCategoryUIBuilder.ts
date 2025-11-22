import {GrammaticalCategory} from "../database/models/GrammaticalCategory";
import {TemplateManager} from "../utils/renderer/TemplateManager";
import {GrammaticalCategoryService} from "../services/GrammaticalCategoryService";
import {GrammaticalGenreUIBuilder} from "./GrammaticalGenreUIBuilder";
import {LanguageUIBuilder} from "./LanguageUIBuilder";
import {EntryUIBuilder} from "./EntryUIBuilder";
import {SettingUIBuilder} from "./SettingUIBuilder";
import {GetSettings} from "../views/pages/index/renderer";

export class GrammaticalCategoryUIBuilder {
    public static isDrawerRevealed: boolean = false;
    private static thumbnailTemplate: Element | undefined = undefined;
    private static leftLeaf: Element;
    private static rightLeaf: Element;
    private static drawer: Element;
    private static grammaticalCategories: GrammaticalCategory[] = [];
    private static previousPageButton: HTMLButtonElement;
    private static nextPageButton: HTMLButtonElement;
    private static currentPage: number = 1;
    public static pageSize: number = 25;
    private static totalPages: number = 1;

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
                SettingUIBuilder.isPanelRevealed = false;
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
        GrammaticalCategoryUIBuilder.grammaticalCategories = await GrammaticalCategoryService.ReadAll(GetSettings().currentDictionary);
        if (!drawer) {
            return;
        } else {
            GrammaticalCategoryUIBuilder.drawer = drawer;
            GrammaticalCategoryUIBuilder.previousPageButton = this.drawer.querySelector("#previous-page-button")!;
            GrammaticalCategoryUIBuilder.nextPageButton = this.drawer.querySelector("#next-page-button")!;
            await GrammaticalCategoryUIBuilder.RenderSearchbar();
            await GrammaticalCategoryUIBuilder.RenderCreateButton();
            await GrammaticalCategoryUIBuilder.RenderList();
            await GrammaticalCategoryUIBuilder.HandlePaginationControls();
            await GrammaticalCategoryUIBuilder.RenderPaginationControls();
            GrammaticalCategoryUIBuilder.leftLeaf.appendChild(GrammaticalCategoryUIBuilder.drawer);
        }
    }

    public static async RenderSearchbar() {
        const searchbar: HTMLInputElement = GrammaticalCategoryUIBuilder.drawer.querySelector<HTMLInputElement>("#searchbar")!;
        searchbar.addEventListener("input", async () => {
            GrammaticalCategoryUIBuilder.currentPage = 1;
            GrammaticalCategoryUIBuilder.grammaticalCategories = await GrammaticalCategoryService.FilterBySearch(GetSettings().currentDictionary, searchbar.value);
            await GrammaticalCategoryUIBuilder.RenderList();
        });
    }

    public static async RenderList() {
        const container: Element = GrammaticalCategoryUIBuilder.drawer.querySelector("#grammatical-category-container")!;
        GrammaticalCategoryUIBuilder.thumbnailTemplate = await TemplateManager.LoadTemplateAsHTML("thumbnails/grammatical-category");
        container.replaceChildren();
        if (!GrammaticalCategoryUIBuilder.grammaticalCategories) GrammaticalCategoryUIBuilder.grammaticalCategories = await GrammaticalCategoryService.ReadAll(GetSettings().currentDictionary);

        GrammaticalCategoryUIBuilder.totalPages = Math.ceil(GrammaticalCategoryUIBuilder.grammaticalCategories.length / GrammaticalCategoryUIBuilder.pageSize);
        const startIndex: number = (GrammaticalCategoryUIBuilder.currentPage - 1) * GrammaticalCategoryUIBuilder.pageSize;
        const endIndex: number = Math.min(startIndex + GrammaticalCategoryUIBuilder.pageSize, GrammaticalCategoryUIBuilder.grammaticalCategories.length);

        const paginatedGrammaticalCategories: GrammaticalCategory[] = GrammaticalCategoryUIBuilder.grammaticalCategories.slice(startIndex, endIndex);

        paginatedGrammaticalCategories.forEach(gc => {
            GrammaticalCategoryUIBuilder.RenderThumbnail(container, gc);
        });

        await GrammaticalCategoryUIBuilder.RenderPageCounter();
        await GrammaticalCategoryUIBuilder.RenderPaginationControls();
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
                GrammaticalCategoryUIBuilder.grammaticalCategories = await GrammaticalCategoryService.FilterBySearch(GetSettings().currentDictionary, query);
                await GrammaticalCategoryUIBuilder.RenderList();
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
                GrammaticalCategoryUIBuilder.grammaticalCategories = await GrammaticalCategoryService.FilterBySearch(GetSettings().currentDictionary, query);
                await GrammaticalCategoryUIBuilder.RenderList();
            }
        });
        GrammaticalCategoryUIBuilder.rightLeaf.appendChild(button);
    }

    public static async RenderPreviousPage() {
        if (GrammaticalCategoryUIBuilder.currentPage > 1) {
            GrammaticalCategoryUIBuilder.currentPage--;
            await GrammaticalCategoryUIBuilder.RenderList();
        }
    }

    public static async RenderNextPage() {
        if (GrammaticalCategoryUIBuilder.currentPage < GrammaticalCategoryUIBuilder.totalPages) {
            GrammaticalCategoryUIBuilder.currentPage++;
            await GrammaticalCategoryUIBuilder.RenderList();
        }
    }

    public static async HandlePaginationControls() {
        GrammaticalCategoryUIBuilder.previousPageButton.addEventListener("click", async (event: Event) => {
            event.preventDefault();
            await GrammaticalCategoryUIBuilder.RenderPreviousPage();
            await GrammaticalCategoryUIBuilder.RenderPaginationControls();
        });
        GrammaticalCategoryUIBuilder.nextPageButton.addEventListener("click", async (event: Event) => {
            event.preventDefault();
            await GrammaticalCategoryUIBuilder.RenderNextPage()
            await GrammaticalCategoryUIBuilder.RenderPaginationControls();
        });
    }

    public static async RenderPaginationControls() {
        if (GrammaticalCategoryUIBuilder.currentPage === 1 || GrammaticalCategoryUIBuilder.totalPages == 1) GrammaticalCategoryUIBuilder.previousPageButton.classList.add("invisible");
        else GrammaticalCategoryUIBuilder.previousPageButton.classList.remove("invisible");
        if (GrammaticalCategoryUIBuilder.currentPage === GrammaticalCategoryUIBuilder.totalPages || GrammaticalCategoryUIBuilder.totalPages == 1) GrammaticalCategoryUIBuilder.nextPageButton.classList.add("invisible");
        else GrammaticalCategoryUIBuilder.nextPageButton.classList.remove("invisible");
    }

    public static async RenderPageCounter() {
        const pageCounter: HTMLParagraphElement = this.drawer.querySelector("#page-counter")!;
        const elementCounter: HTMLParagraphElement = this.drawer.querySelector("#element-counter")!;
        pageCounter.textContent = String(GrammaticalCategoryUIBuilder.currentPage) + "/" + String(GrammaticalCategoryUIBuilder.totalPages);
        elementCounter.textContent = String(GrammaticalCategoryUIBuilder.pageSize + " Éléments affichés.");
    }
}