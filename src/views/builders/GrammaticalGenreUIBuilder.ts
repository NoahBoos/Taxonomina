import {TemplateManager} from "../../utils/renderer/TemplateManager";
import {GrammaticalGenre} from "../../database/models/GrammaticalGenre";
import {GrammaticalGenreService} from "../../utils/renderer/services/GrammaticalGenreService";
import {GrammaticalCategoryUIBuilder} from "./GrammaticalCategoryUIBuilder";
import {LanguageUIBuilder} from "./LanguageUIBuilder";
import {EntryUIBuilder} from "./EntryUIBuilder";
import {SettingUIBuilder} from "./SettingUIBuilder";

export class GrammaticalGenreUIBuilder {
    public static isDrawerRevealed: boolean = false;
    private static leftLeaf: Element;
    private static rightLeaf: Element;
    private static drawer: Element;

    public static async Initialize() {
        GrammaticalGenreUIBuilder.leftLeaf = document.querySelector("#left-leaf")!;
        GrammaticalGenreUIBuilder.rightLeaf = document.querySelector("#right-leaf")!;
        const drawerButton: HTMLButtonElement = document.querySelector<HTMLButtonElement>("#grammatical-genre-drawer-button")!;
        drawerButton.addEventListener("click", async () => {
            GrammaticalGenreUIBuilder.isDrawerRevealed = !GrammaticalGenreUIBuilder.isDrawerRevealed;

            if (GrammaticalGenreUIBuilder.isDrawerRevealed) {
                EntryUIBuilder.isDrawerRevealed = false;
                GrammaticalCategoryUIBuilder.isDrawerRevealed = false;
                LanguageUIBuilder.isDrawerRevealed = false;
                SettingUIBuilder.isDrawerRevealed = false;
                await GrammaticalGenreUIBuilder.Drawer();
            } else {
                GrammaticalGenreUIBuilder.leftLeaf.replaceChildren();
                GrammaticalGenreUIBuilder.leftLeaf.classList.add('hidden');
            }
        });
    }

    public static async Drawer() {
        GrammaticalGenreUIBuilder.leftLeaf.classList.remove('hidden');
        GrammaticalGenreUIBuilder.leftLeaf.replaceChildren();
        const drawer: Element | undefined = await TemplateManager.LoadTemplateAsHTML("drawers/grammatical-genre");
        const gramGenres: GrammaticalGenre[] = await GrammaticalGenreService.ReadAll();
        if (!drawer) {
            return;
        } else {
            GrammaticalGenreUIBuilder.drawer = drawer;
            await GrammaticalGenreUIBuilder.Searchbar();
            await GrammaticalGenreUIBuilder.CreateButton();
            await GrammaticalGenreUIBuilder.List(gramGenres);
            GrammaticalGenreUIBuilder.leftLeaf.appendChild(GrammaticalGenreUIBuilder.drawer);
        }
    }

    public static async Searchbar() {
        const searchbar: HTMLInputElement = GrammaticalGenreUIBuilder.drawer.querySelector<HTMLInputElement>("#searchbar")!;
        searchbar.addEventListener("input", async () => {
           const grammaticalGenres: GrammaticalGenre[] = await GrammaticalGenreService.FilterBySearch(searchbar.value);
           await GrammaticalGenreUIBuilder.List(grammaticalGenres);
        });
    }

    public static async List(gramGenres?: GrammaticalGenre[]) {
        const container: Element = GrammaticalGenreUIBuilder.drawer.querySelector<HTMLDivElement>("#grammatical-genre-container")!;
        const thumbnailTemplate: Element | undefined = await TemplateManager.LoadTemplateAsHTML("thumbnails/grammatical-genre");
        if (!thumbnailTemplate) return;
        container.replaceChildren();
        if (!gramGenres) gramGenres = await GrammaticalGenreService.ReadAll();

        gramGenres.forEach((gramGenre: GrammaticalGenre) => {
            const thumbnail: Element = thumbnailTemplate.cloneNode(true) as Element;
            const thumbnailButton: HTMLButtonElement = thumbnail.querySelector<HTMLButtonElement>("button")!;
            thumbnailButton.id = String(gramGenre.GetId());
            thumbnailButton.innerText = gramGenre.GetName();
            thumbnailButton.addEventListener("click", async () => {
                GrammaticalGenreUIBuilder.rightLeaf.replaceChildren();
                await GrammaticalGenreUIBuilder.Form(gramGenre);
            });
            container.appendChild(thumbnail);
        });
    }

    public static async Form(gramGenre?: GrammaticalGenre) {
        GrammaticalGenreUIBuilder.rightLeaf.replaceChildren();
        const form: Element | undefined = await TemplateManager.LoadTemplateAsHTML("forms/grammatical-genre");
        if (!form) return;

        const title: HTMLHeadingElement = form.querySelector<HTMLHeadingElement>('[data-role="form-title"]')!;
        const inputName: HTMLInputElement = form.querySelector<HTMLInputElement>("#name")!;
        const inputId: HTMLInputElement = form.querySelector<HTMLInputElement>("#id")!;
        const submitButton: HTMLButtonElement = form.querySelector<HTMLButtonElement>("button")!;

        if (!gramGenre) {
            title.textContent = "Création - Genre grammatical";
            submitButton.innerText = "Créer";
        } else {
            title.textContent = "Modification - " + gramGenre.GetName();
            inputName.value = gramGenre.GetName();
            inputId.value = String(gramGenre.GetId());
            submitButton.innerText = "Mettre à jour";
        }

        submitButton.addEventListener("click", async (event: Event) => {
            event.preventDefault();
            const [success, savedGrammaticalGenre] = await GrammaticalGenreService.ProcessForm(form);
            if (success && savedGrammaticalGenre) {
                const query: string = GrammaticalGenreUIBuilder.drawer.querySelector<HTMLInputElement>("#searchbar")!.value.toLowerCase();
                await GrammaticalGenreUIBuilder.List();
                const grammaticalGenres: GrammaticalGenre[] = await GrammaticalGenreService.FilterBySearch(query);
                await GrammaticalGenreUIBuilder.List(grammaticalGenres);
                await GrammaticalGenreUIBuilder.Form(savedGrammaticalGenre ? savedGrammaticalGenre : undefined);
            }
        });

        GrammaticalGenreUIBuilder.rightLeaf.appendChild(form);
        if (gramGenre) await GrammaticalGenreUIBuilder.DeleteButton(gramGenre);
    }

    public static async CreateButton() {
        const button: HTMLButtonElement = GrammaticalGenreUIBuilder.drawer.querySelector<HTMLButtonElement>("#create-button")!;
        button.addEventListener("click", async () => {
            GrammaticalGenreUIBuilder.rightLeaf.replaceChildren();
            await GrammaticalGenreUIBuilder.Form();
        })
    }

    public static async DeleteButton(gramGenre: GrammaticalGenre) {
        const button: Element | undefined = await TemplateManager.LoadTemplateAsHTML("buttons/delete");
        if (!button) return;
        button.id = String(gramGenre.GetId());
        button.addEventListener("click", async () => {
            const success: boolean = await GrammaticalGenreService.Delete(gramGenre);
            if (success) {
                GrammaticalGenreUIBuilder.rightLeaf.replaceChildren();
                const query: string = GrammaticalGenreUIBuilder.drawer.querySelector<HTMLInputElement>("#searchbar")!.value.toLowerCase();
                const grammaticalGenres: GrammaticalGenre[] = await GrammaticalGenreService.FilterBySearch(query);
                await GrammaticalGenreUIBuilder.List(grammaticalGenres);
            }
        });
        GrammaticalGenreUIBuilder.rightLeaf.appendChild(button);
    }
}