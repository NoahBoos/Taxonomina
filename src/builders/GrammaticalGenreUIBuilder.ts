import {TemplateManager} from "../utils/renderer/TemplateManager";
import {GrammaticalGenre} from "../database/models/GrammaticalGenre";
import {GrammaticalGenreService} from "../services/GrammaticalGenreService";
import {GrammaticalCategoryUIBuilder} from "./GrammaticalCategoryUIBuilder";
import {LanguageUIBuilder} from "./LanguageUIBuilder";
import {EntryUIBuilder} from "./EntryUIBuilder";
import {SettingUIBuilder} from "./SettingUIBuilder";
import {GetSettings} from "../views/pages/index/renderer";

export class GrammaticalGenreUIBuilder {
    public static isDrawerRevealed: boolean = false;
    private static thumbnailTemplate: Element | undefined = undefined;
    private static leftLeaf: Element;
    private static rightLeaf: Element;
    private static drawer: Element;
    private static grammaticalGenres: GrammaticalGenre[] = [];
    private static previousPageButton: HTMLButtonElement;
    private static nextPageButton: HTMLButtonElement;
    private static currentPage: number = 1;
    public static pageSize: number = 25;
    private static totalPages: number = 1;

    public static async Initialize() {
        GrammaticalGenreUIBuilder.leftLeaf = document.querySelector("#left-leaf")!;
        GrammaticalGenreUIBuilder.rightLeaf = document.querySelector("#right-leaf")!;
        const button: HTMLButtonElement = document.querySelector<HTMLButtonElement>("#grammatical-genre-drawer-button")!;
        button.addEventListener("click", async (event: Event) => {
            event.preventDefault();
            GrammaticalGenreUIBuilder.isDrawerRevealed = !GrammaticalGenreUIBuilder.isDrawerRevealed;

            if (GrammaticalGenreUIBuilder.isDrawerRevealed) {
                EntryUIBuilder.isDrawerRevealed = false;
                GrammaticalCategoryUIBuilder.isDrawerRevealed = false;
                LanguageUIBuilder.isDrawerRevealed = false;
                SettingUIBuilder.isPanelRevealed = false;
                await GrammaticalGenreUIBuilder.RenderDrawer();
            } else {
                GrammaticalGenreUIBuilder.leftLeaf.replaceChildren();
                GrammaticalGenreUIBuilder.leftLeaf.classList.add('hidden');
            }
        });
    }

    public static async RenderDrawer() {
        GrammaticalGenreUIBuilder.leftLeaf.classList.remove('hidden');
        GrammaticalGenreUIBuilder.leftLeaf.replaceChildren();
        const drawer: Element | undefined = await TemplateManager.LoadTemplateAsHTML("drawers/grammatical-genre");
        GrammaticalGenreUIBuilder.grammaticalGenres = await GrammaticalGenreService.ReadAll(GetSettings().currentDictionary);
        if (!drawer) {
            return;
        } else {
            GrammaticalGenreUIBuilder.drawer = drawer;
            GrammaticalGenreUIBuilder.previousPageButton = this.drawer.querySelector("#previous-page-button")!;
            GrammaticalGenreUIBuilder.nextPageButton = this.drawer.querySelector("#next-page-button")!;
            await GrammaticalGenreUIBuilder.RenderSearchbar();
            await GrammaticalGenreUIBuilder.RenderCreateButton();
            await GrammaticalGenreUIBuilder.RenderList();
            await GrammaticalGenreUIBuilder.HandlePaginationControls();
            await GrammaticalGenreUIBuilder.RenderPaginationControls();
            GrammaticalGenreUIBuilder.leftLeaf.appendChild(GrammaticalGenreUIBuilder.drawer);
        }
    }

    public static async RenderSearchbar() {
        const searchbar: HTMLInputElement = GrammaticalGenreUIBuilder.drawer.querySelector<HTMLInputElement>("#searchbar")!;
        searchbar.addEventListener("input", async () => {
            GrammaticalGenreUIBuilder.currentPage = 1;
            GrammaticalGenreUIBuilder.grammaticalGenres = await GrammaticalGenreService.FilterBySearch(GetSettings().currentDictionary, searchbar.value);
            await GrammaticalGenreUIBuilder.RenderList();
        });
    }

    public static async RenderList() {
        const container: Element = GrammaticalGenreUIBuilder.drawer.querySelector<HTMLDivElement>("#grammatical-genre-container")!;
        GrammaticalGenreUIBuilder.thumbnailTemplate = await TemplateManager.LoadTemplateAsHTML("thumbnails/grammatical-genre");
        container.replaceChildren();
        if (!GrammaticalGenreUIBuilder.grammaticalGenres) GrammaticalGenreUIBuilder.grammaticalGenres = await GrammaticalGenreService.ReadAll(GetSettings().currentDictionary);

        GrammaticalGenreUIBuilder.totalPages = Math.ceil(GrammaticalGenreUIBuilder.grammaticalGenres.length / GrammaticalGenreUIBuilder.pageSize);
        const startIndex: number = (GrammaticalGenreUIBuilder.currentPage - 1) * GrammaticalGenreUIBuilder.pageSize;
        const endIndex: number = Math.min(startIndex + GrammaticalGenreUIBuilder.pageSize, GrammaticalGenreUIBuilder.grammaticalGenres.length);

        const paginatedGrammaticalGenres: GrammaticalGenre[] = GrammaticalGenreUIBuilder.grammaticalGenres.slice(startIndex, endIndex);

        paginatedGrammaticalGenres.forEach(gg => {
            GrammaticalGenreUIBuilder.RenderThumbnail(container, gg);
        });

        await GrammaticalGenreUIBuilder.RenderPageCounter();
        await GrammaticalGenreUIBuilder.RenderPaginationControls();
    }

    public static async RenderThumbnail(container: Element, grammaticalGenre: GrammaticalGenre) {
        const thumbnail = GrammaticalGenreUIBuilder.thumbnailTemplate?.cloneNode(true) as Element;
        const button: HTMLButtonElement = thumbnail.querySelector<HTMLButtonElement>("button")!;
        button.innerText = grammaticalGenre.GetName();
        button.addEventListener("click", async (event: Event) => {
            event.preventDefault();
            await GrammaticalGenreUIBuilder.RenderForm(grammaticalGenre);
        });
        container.appendChild(thumbnail);
    }

    public static async RenderForm(grammaticalGenre?: GrammaticalGenre) {
        GrammaticalGenreUIBuilder.rightLeaf.replaceChildren();
        const form: Element | undefined = await TemplateManager.LoadTemplateAsHTML("forms/grammatical-genre");
        if (!form) return;

        const title: HTMLHeadingElement = form.querySelector<HTMLHeadingElement>('[data-role="form-title"]')!;
        const inputName: HTMLInputElement = form.querySelector<HTMLInputElement>("#name")!;
        const inputId: HTMLInputElement = form.querySelector<HTMLInputElement>("#id")!;
        const submitButton: HTMLButtonElement = form.querySelector<HTMLButtonElement>("button")!;

        if (!grammaticalGenre) {
            title.textContent = "Création - Genre grammatical";
            submitButton.innerText = "Créer";
        } else {
            title.textContent = "Modification - " + grammaticalGenre.GetName();
            inputName.value = grammaticalGenre.GetName();
            inputId.value = String(grammaticalGenre.GetId());
            submitButton.innerText = "Mettre à jour";
        }

        submitButton.addEventListener("click", async (event: Event) => {
            event.preventDefault();
            const [success, savedGrammaticalGenre] = await GrammaticalGenreService.ProcessForm(form);
            if (success && savedGrammaticalGenre) {
                const query: string = GrammaticalGenreUIBuilder.drawer.querySelector<HTMLInputElement>("#searchbar")!.value.toLowerCase();
                await GrammaticalGenreUIBuilder.RenderList();
                GrammaticalGenreUIBuilder.grammaticalGenres = await GrammaticalGenreService.FilterBySearch(GetSettings().currentDictionary, query);
                await GrammaticalGenreUIBuilder.RenderList();
                await GrammaticalGenreUIBuilder.RenderForm(savedGrammaticalGenre ? savedGrammaticalGenre : undefined);
            }
        });

        GrammaticalGenreUIBuilder.rightLeaf.appendChild(form);
        if (grammaticalGenre) await GrammaticalGenreUIBuilder.RenderDeleteButton(grammaticalGenre);
    }

    public static async RenderCreateButton() {
        const button: HTMLButtonElement = GrammaticalGenreUIBuilder.drawer.querySelector<HTMLButtonElement>("#create-button")!;
        button.addEventListener("click", async (event: Event) => {
            event.preventDefault();
            GrammaticalGenreUIBuilder.rightLeaf.replaceChildren();
            await GrammaticalGenreUIBuilder.RenderForm();
        })
    }

    public static async RenderDeleteButton(grammaticalGenre: GrammaticalGenre) {
        const button: Element | undefined = await TemplateManager.LoadTemplateAsHTML("buttons/delete");
        if (!button) return;
        button.id = String(grammaticalGenre.GetId());
        button.addEventListener("click", async (event: Event) => {
            event.preventDefault();
            const success: boolean = await GrammaticalGenreService.Delete(grammaticalGenre);
            if (success) {
                GrammaticalGenreUIBuilder.rightLeaf.replaceChildren();
                const query: string = GrammaticalGenreUIBuilder.drawer.querySelector<HTMLInputElement>("#searchbar")!.value.toLowerCase();
                GrammaticalGenreUIBuilder.grammaticalGenres = await GrammaticalGenreService.FilterBySearch(GetSettings().currentDictionary, query);
                await GrammaticalGenreUIBuilder.RenderList();
            }
        });
        GrammaticalGenreUIBuilder.rightLeaf.appendChild(button);
    }

    public static async RenderPreviousPage() {
        if (GrammaticalGenreUIBuilder.currentPage > 1) {
            GrammaticalGenreUIBuilder.currentPage--;
            await GrammaticalGenreUIBuilder.RenderList();
        }
    }

    public static async RenderNextPage() {
        if (GrammaticalGenreUIBuilder.currentPage < GrammaticalGenreUIBuilder.totalPages) {
            GrammaticalGenreUIBuilder.currentPage++;
            await GrammaticalGenreUIBuilder.RenderList();
        }
    }

    public static async HandlePaginationControls() {
        GrammaticalGenreUIBuilder.previousPageButton.addEventListener("click", async (event: Event) => {
            event.preventDefault();
            await GrammaticalGenreUIBuilder.RenderPreviousPage();
            await GrammaticalGenreUIBuilder.RenderPaginationControls();
        });
        GrammaticalGenreUIBuilder.nextPageButton.addEventListener("click", async (event: Event) => {
            event.preventDefault();
            await GrammaticalGenreUIBuilder.RenderNextPage()
            await GrammaticalGenreUIBuilder.RenderPaginationControls();
        });
    }

    public static async RenderPaginationControls() {
        if (GrammaticalGenreUIBuilder.currentPage === 1 || GrammaticalGenreUIBuilder.totalPages == 1) GrammaticalGenreUIBuilder.previousPageButton.classList.add("invisible");
        else GrammaticalGenreUIBuilder.previousPageButton.classList.remove("invisible");
        if (GrammaticalGenreUIBuilder.currentPage === GrammaticalGenreUIBuilder.totalPages || GrammaticalGenreUIBuilder.totalPages == 1) GrammaticalGenreUIBuilder.nextPageButton.classList.add("invisible");
        else GrammaticalGenreUIBuilder.nextPageButton.classList.remove("invisible");
    }

    public static async RenderPageCounter() {
        const pageCounter: HTMLParagraphElement = this.drawer.querySelector("#page-counter")!;
        const elementCounter: HTMLParagraphElement = this.drawer.querySelector("#element-counter")!;
        pageCounter.textContent = String(GrammaticalGenreUIBuilder.currentPage) + "/" + String(GrammaticalGenreUIBuilder.totalPages);
        elementCounter.textContent = String(GrammaticalGenreUIBuilder.pageSize + " Éléments affichés.");
    }
}