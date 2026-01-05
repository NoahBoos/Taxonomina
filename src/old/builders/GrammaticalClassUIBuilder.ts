import {GrammaticalClass} from "../../shared/models/GrammaticalClass";
import {TemplateManager} from "../../renderer/utils/TemplateManager";
import {GrammaticalClassService} from "src/renderer/services/GrammaticalClassService";
import {GrammaticalGenreUIBuilder} from "./GrammaticalGenreUIBuilder";
import {LanguageUIBuilder} from "./LanguageUIBuilder";
import {EntryUIBuilder} from "./EntryUIBuilder";
import {SettingUIBuilder} from "./SettingUIBuilder";
import {GetSettings} from "../../renderer/pages/index/index.renderer";

export class GrammaticalClassUIBuilder {
    public static isDrawerRevealed: boolean = false;
    private static thumbnailTemplate: Element | undefined = undefined;
    private static leftLeaf: Element;
    private static rightLeaf: Element;
    private static drawer: Element;
    private static grammaticalClasses: GrammaticalClass[] = [];
    private static paginationContainer: Element;
    private static previousPageButton: HTMLButtonElement;
    private static nextPageButton: HTMLButtonElement;
    private static currentPage: number = 1;
    public static pageSize: number = 25;
    private static totalPages: number = 1;

    public static async Initialize() {
        GrammaticalClassUIBuilder.leftLeaf = document.querySelector("#left-leaf")!;
        GrammaticalClassUIBuilder.rightLeaf = document.querySelector("#right-leaf")!;

        const button: HTMLButtonElement = document.querySelector<HTMLButtonElement>("#grammatical-class-drawer-button")!;
        button.addEventListener("click", async (event: Event) => {
            event.preventDefault();
            GrammaticalClassUIBuilder.isDrawerRevealed = !GrammaticalClassUIBuilder.isDrawerRevealed;

            if (GrammaticalClassUIBuilder.isDrawerRevealed) {
                EntryUIBuilder.isDrawerRevealed = false;
                GrammaticalGenreUIBuilder.isDrawerRevealed = false;
                LanguageUIBuilder.isDrawerRevealed = false;
                SettingUIBuilder.isPanelRevealed = false;
                await GrammaticalClassUIBuilder.RenderDrawer();
            } else {
                GrammaticalClassUIBuilder.leftLeaf.replaceChildren();
                GrammaticalClassUIBuilder.leftLeaf.classList.add('hidden');
            }
        });
    }

    public static async RenderDrawer() {
        GrammaticalClassUIBuilder.leftLeaf.classList.remove('hidden');
        GrammaticalClassUIBuilder.leftLeaf.replaceChildren();
        const drawer: Element | undefined = await TemplateManager.LoadTemplateAsHTML("drawers/grammatical-class");
        GrammaticalClassUIBuilder.grammaticalClasses = await GrammaticalClassService.ReadAll(GetSettings().currentDictionary);
        if (!drawer) {
            return;
        } else {
            GrammaticalClassUIBuilder.drawer = drawer;
            GrammaticalClassUIBuilder.paginationContainer = this.drawer.querySelector("#pagination-container")!;
            GrammaticalClassUIBuilder.previousPageButton = this.drawer.querySelector("#previous-page-button")!;
            GrammaticalClassUIBuilder.nextPageButton = this.drawer.querySelector("#next-page-button")!;
            await GrammaticalClassUIBuilder.RenderSearchbar();
            await GrammaticalClassUIBuilder.RenderCreateButton();
            await GrammaticalClassUIBuilder.RenderList();
            await GrammaticalClassUIBuilder.HandlePaginationControls();
            await GrammaticalClassUIBuilder.RenderPaginationControls();
            GrammaticalClassUIBuilder.leftLeaf.appendChild(GrammaticalClassUIBuilder.drawer);
        }
    }

    public static async RenderSearchbar() {
        const searchbar: HTMLInputElement = GrammaticalClassUIBuilder.drawer.querySelector<HTMLInputElement>("#searchbar")!;
        searchbar.addEventListener("input", async () => {
            GrammaticalClassUIBuilder.currentPage = 1;
            GrammaticalClassUIBuilder.grammaticalClasses = await GrammaticalClassService.FilterBySearch(GetSettings().currentDictionary, searchbar.value);
            await GrammaticalClassUIBuilder.RenderList();
        });
    }

    public static async RenderList() {
        const container: Element = GrammaticalClassUIBuilder.drawer.querySelector("#grammatical-class-container")!;
        GrammaticalClassUIBuilder.thumbnailTemplate = await TemplateManager.LoadTemplateAsHTML("thumbnails/grammatical-class");
        container.replaceChildren();
        if (!GrammaticalClassUIBuilder.grammaticalClasses) GrammaticalClassUIBuilder.grammaticalClasses = await GrammaticalClassService.ReadAll(GetSettings().currentDictionary);

        GrammaticalClassUIBuilder.totalPages = Math.ceil(GrammaticalClassUIBuilder.grammaticalClasses.length / GrammaticalClassUIBuilder.pageSize);
        const startIndex: number = (GrammaticalClassUIBuilder.currentPage - 1) * GrammaticalClassUIBuilder.pageSize;
        const endIndex: number = Math.min(startIndex + GrammaticalClassUIBuilder.pageSize, GrammaticalClassUIBuilder.grammaticalClasses.length);

        const paginatedGrammaticalClass: GrammaticalClass[] = GrammaticalClassUIBuilder.grammaticalClasses.slice(startIndex, endIndex);

        paginatedGrammaticalClass.forEach(gc => {
            GrammaticalClassUIBuilder.RenderThumbnail(container, gc);
        });

        await GrammaticalClassUIBuilder.RenderPageCounter();
        await GrammaticalClassUIBuilder.RenderPaginationControls();
    }

    public static async RenderThumbnail(container: Element, grammaticalClass: GrammaticalClass) {
        const thumbnail = GrammaticalClassUIBuilder.thumbnailTemplate?.cloneNode(true) as Element;
        const button: HTMLButtonElement = thumbnail.querySelector<HTMLButtonElement>("button")!;
        button.innerText = grammaticalClass.GetName();
        button.addEventListener("click", async (event: Event) => {
            event.preventDefault();
            await GrammaticalClassUIBuilder.RenderForm(grammaticalClass);
        });
        container.appendChild(thumbnail);
    }

    public static async RenderForm(grammaticalClass?: GrammaticalClass) {
        GrammaticalClassUIBuilder.rightLeaf.replaceChildren();
        const form: Element | undefined = await TemplateManager.LoadTemplateAsHTML("forms/grammatical-class");
        if (!form) return;

        const title: HTMLHeadingElement = form.querySelector<HTMLHeadingElement>('[data-role="form-title"]')!;
        const inputName: HTMLInputElement = form.querySelector<HTMLInputElement>("#name")!;
        const inputId: HTMLInputElement = form.querySelector<HTMLInputElement>("#id")!;
        const submitButton: HTMLButtonElement = form.querySelector<HTMLButtonElement>("button")!;

        if (!grammaticalClass) {
            title.textContent = "Création - Classe grammaticale";
            submitButton.innerText = "Créer";
        } else {
            title.textContent = "Modification - " + grammaticalClass.GetName();
            inputName.value = grammaticalClass.GetName();
            inputId.value = String(grammaticalClass.GetId());
            submitButton.innerText = "Mettre à jour";
        }

        submitButton.addEventListener("click", async (event: Event) => {
            event.preventDefault();
            let [success, savedGrammaticalClass]: [boolean, GrammaticalClass | undefined] = await GrammaticalClassService.ProcessForm(form);
            if (success && savedGrammaticalClass) {
                const query: string = GrammaticalClassUIBuilder.drawer.querySelector<HTMLInputElement>("#searchbar")!.value;
                GrammaticalClassUIBuilder.grammaticalClasses = await GrammaticalClassService.FilterBySearch(GetSettings().currentDictionary, query);
                await GrammaticalClassUIBuilder.RenderList();
                await GrammaticalClassUIBuilder.RenderForm(savedGrammaticalClass ? savedGrammaticalClass : undefined);
            }
        });

        GrammaticalClassUIBuilder.rightLeaf.appendChild(form);
        if (grammaticalClass) await GrammaticalClassUIBuilder.RenderDeleteButton(grammaticalClass);
    }

    public static async RenderCreateButton() {
        const button: HTMLButtonElement = GrammaticalClassUIBuilder.drawer.querySelector<HTMLButtonElement>("#create-button")!;
        button.addEventListener("click", async (event: Event) => {
            event.preventDefault();
            GrammaticalClassUIBuilder.rightLeaf.replaceChildren();
            await GrammaticalClassUIBuilder.RenderForm();
        });
    }

    public static async RenderDeleteButton(grammaticalClass: GrammaticalClass) {
        const button: Element | undefined = await TemplateManager.LoadTemplateAsHTML("buttons/delete");
        if (!button) return;
        button.addEventListener("click", async (event: Event) => {
            event.preventDefault();
            const success: boolean = await GrammaticalClassService.Delete(grammaticalClass);
            if (success) {
                GrammaticalClassUIBuilder.rightLeaf.replaceChildren();
                const query: string = GrammaticalClassUIBuilder.drawer.querySelector<HTMLInputElement>("#searchbar")!.value;
                GrammaticalClassUIBuilder.grammaticalClasses = await GrammaticalClassService.FilterBySearch(GetSettings().currentDictionary, query);
                await GrammaticalClassUIBuilder.RenderList();
            }
        });
        GrammaticalClassUIBuilder.rightLeaf.appendChild(button);
    }

    public static async RenderPreviousPage() {
        if (GrammaticalClassUIBuilder.currentPage > 1) {
            GrammaticalClassUIBuilder.currentPage--;
            await GrammaticalClassUIBuilder.RenderList();
        }
    }

    public static async RenderNextPage() {
        if (GrammaticalClassUIBuilder.currentPage < GrammaticalClassUIBuilder.totalPages) {
            GrammaticalClassUIBuilder.currentPage++;
            await GrammaticalClassUIBuilder.RenderList();
        }
    }

    public static async HandlePaginationControls() {
        GrammaticalClassUIBuilder.previousPageButton.addEventListener("click", async (event: Event) => {
            event.preventDefault();
            await GrammaticalClassUIBuilder.RenderPreviousPage();
            await GrammaticalClassUIBuilder.RenderPaginationControls();
        });
        GrammaticalClassUIBuilder.nextPageButton.addEventListener("click", async (event: Event) => {
            event.preventDefault();
            await GrammaticalClassUIBuilder.RenderNextPage()
            await GrammaticalClassUIBuilder.RenderPaginationControls();
        });
    }

    public static async RenderPaginationControls() {
        if (GrammaticalClassUIBuilder.totalPages == 0) GrammaticalClassUIBuilder.paginationContainer.classList.add("hidden")
        else GrammaticalClassUIBuilder.paginationContainer.classList.remove("hidden");
        if (GrammaticalClassUIBuilder.currentPage === 1 || GrammaticalClassUIBuilder.totalPages == 1) GrammaticalClassUIBuilder.previousPageButton.classList.add("invisible")
        else GrammaticalClassUIBuilder.previousPageButton.classList.remove("invisible");
        if (GrammaticalClassUIBuilder.currentPage === GrammaticalClassUIBuilder.totalPages || GrammaticalClassUIBuilder.totalPages == 1) GrammaticalClassUIBuilder.nextPageButton.classList.add("invisible")
        else GrammaticalClassUIBuilder.nextPageButton.classList.remove("invisible");
    }

    public static async RenderPageCounter() {
        const pageCounter: HTMLParagraphElement = this.drawer.querySelector("#page-counter")!;
        const elementCounter: HTMLParagraphElement = this.drawer.querySelector("#element-counter")!;
        pageCounter.textContent = String(GrammaticalClassUIBuilder.totalPages >= 1 ? GrammaticalClassUIBuilder.currentPage : 0) + "/" + String(GrammaticalClassUIBuilder.totalPages);
        elementCounter.textContent = String(GrammaticalClassUIBuilder.pageSize + " Éléments affichés.");
    }
}