import {TemplateManager} from "../../utils/renderer/TemplateManager";
import {GrammaticalGenre} from "../../database/models/GrammaticalGenre";
import {GrammaticalGenreService} from "../../utils/renderer/services/GrammaticalGenreService";
import {GrammaticalCategoryUIBuilder} from "./GrammaticalCategoryUIBuilder";
import {LanguageUIBuilder} from "./LanguageUIBuilder";
import {EntryUIBuilder} from "./EntryUIBuilder";
import {SettingUIBuilder} from "./SettingUIBuilder";

export class GrammaticalGenreUIBuilder {
    public static isDrawerRevealed: boolean = false;
    private static thumbnailTemplate: Element | undefined = undefined;
    private static leftLeaf: Element;
    private static rightLeaf: Element;
    private static drawer: Element;

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
                SettingUIBuilder.isDrawerRevealed = false;
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
        const grammaticalGenres: GrammaticalGenre[] = await GrammaticalGenreService.ReadAll();
        if (!drawer) {
            return;
        } else {
            GrammaticalGenreUIBuilder.drawer = drawer;
            await GrammaticalGenreUIBuilder.RenderSearchbar();
            await GrammaticalGenreUIBuilder.RenderCreateButton();
            await GrammaticalGenreUIBuilder.RenderList(grammaticalGenres);
            GrammaticalGenreUIBuilder.leftLeaf.appendChild(GrammaticalGenreUIBuilder.drawer);
        }
    }

    public static async RenderSearchbar() {
        const searchbar: HTMLInputElement = GrammaticalGenreUIBuilder.drawer.querySelector<HTMLInputElement>("#searchbar")!;
        searchbar.addEventListener("input", async () => {
           const grammaticalGenres: GrammaticalGenre[] = await GrammaticalGenreService.FilterBySearch(searchbar.value);
           await GrammaticalGenreUIBuilder.RenderList(grammaticalGenres);
        });
    }

    public static async RenderList(grammaticalGenres?: GrammaticalGenre[]) {
        const container: Element = GrammaticalGenreUIBuilder.drawer.querySelector<HTMLDivElement>("#grammatical-genre-container")!;
        GrammaticalGenreUIBuilder.thumbnailTemplate = await TemplateManager.LoadTemplateAsHTML("thumbnails/grammatical-genre");
        container.replaceChildren();
        if (!grammaticalGenres) grammaticalGenres = await GrammaticalGenreService.ReadAll();

        grammaticalGenres.forEach(gg => {
            GrammaticalGenreUIBuilder.RenderThumbnail(container, gg);
        });
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
                const grammaticalGenres: GrammaticalGenre[] = await GrammaticalGenreService.FilterBySearch(query);
                await GrammaticalGenreUIBuilder.RenderList(grammaticalGenres);
                await GrammaticalGenreUIBuilder.RenderForm(savedGrammaticalGenre ? savedGrammaticalGenre : undefined);
            }
        });

        GrammaticalGenreUIBuilder.rightLeaf.appendChild(form);
        if (grammaticalGenre) await GrammaticalGenreUIBuilder.RenderDeleteButton(grammaticalGenre);
    }

    public static async RenderCreateButton() {
        const button: HTMLButtonElement = GrammaticalGenreUIBuilder.drawer.querySelector<HTMLButtonElement>("#create-button")!;
        button.addEventListener("click", async () => {
            GrammaticalGenreUIBuilder.rightLeaf.replaceChildren();
            await GrammaticalGenreUIBuilder.RenderForm();
        })
    }

    public static async RenderDeleteButton(grammaticalGenre: GrammaticalGenre) {
        const button: Element | undefined = await TemplateManager.LoadTemplateAsHTML("buttons/delete");
        if (!button) return;
        button.id = String(grammaticalGenre.GetId());
        button.addEventListener("click", async () => {
            const success: boolean = await GrammaticalGenreService.Delete(grammaticalGenre);
            if (success) {
                GrammaticalGenreUIBuilder.rightLeaf.replaceChildren();
                const query: string = GrammaticalGenreUIBuilder.drawer.querySelector<HTMLInputElement>("#searchbar")!.value.toLowerCase();
                const grammaticalGenres: GrammaticalGenre[] = await GrammaticalGenreService.FilterBySearch(query);
                await GrammaticalGenreUIBuilder.RenderList(grammaticalGenres);
            }
        });
        GrammaticalGenreUIBuilder.rightLeaf.appendChild(button);
    }
}