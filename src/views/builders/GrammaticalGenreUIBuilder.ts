import {TemplateManager} from "../../utils/renderer/TemplateManager";
import {GrammaticalGenre} from "../../database/models/GrammaticalGenre";
import {GrammaticalGenreService} from "../../utils/renderer/services/GrammaticalGenreService";
import {GrammaticalCategoryUIBuilder} from "./GrammaticalCategoryUIBuilder";
import {LanguageUIBuilder} from "./LanguageUIBuilder";
import {EntryUIBuilder} from "./EntryUIBuilder";

export class GrammaticalGenreUIBuilder {
    public static isDrawerRevealed: boolean = false;

    public static async Initialize() {
        const drawerButton: HTMLButtonElement = document.querySelector<HTMLButtonElement>("#grammatical-genre-drawer-button")!;
        drawerButton.addEventListener("click", async () => {
            GrammaticalGenreUIBuilder.isDrawerRevealed = !GrammaticalGenreUIBuilder.isDrawerRevealed;

            if (GrammaticalGenreUIBuilder.isDrawerRevealed) {
                EntryUIBuilder.isDrawerRevealed = false;
                GrammaticalCategoryUIBuilder.isDrawerRevealed = false;
                LanguageUIBuilder.isDrawerRevealed = false;
                await GrammaticalGenreUIBuilder.Drawer();
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
        const drawer: Element | undefined = await TemplateManager.LoadTemplateAsHTML("drawers/grammatical-genre");
        const gramGenres: GrammaticalGenre[] = await GrammaticalGenreService.ReadAll();
        if (!drawer) {
            return;
        } else {
            await GrammaticalGenreUIBuilder.Searchbar(drawer);
            await GrammaticalGenreUIBuilder.CreateButton(drawer);
            await GrammaticalGenreUIBuilder.List(drawer, gramGenres);
            leftLeaf.appendChild(drawer);
        }
    }

    public static async Searchbar(drawer: Element) {
        const searchbar: HTMLInputElement = drawer.querySelector<HTMLInputElement>("#searchbar")!;
        searchbar.addEventListener("input", async () => {
           const query: string = searchbar.value.toLowerCase();
           await GrammaticalGenreUIBuilder.UpdateSearchbar(drawer, query);
        });
    }

    public static async UpdateSearchbar(drawer: Element, query: string) {
        const gramGenres: GrammaticalGenre[] = await GrammaticalGenreService.ReadAll();
        const filteredGramGenres: GrammaticalGenre[] = gramGenres.filter((gramGenre: GrammaticalGenre) => {
            return [gramGenre.GetName()].some(value => value.toLowerCase().includes(query));
        });
        await GrammaticalGenreUIBuilder.List(drawer, filteredGramGenres);
    }

    public static async List(drawer: Element, gramGenres?: GrammaticalGenre[]) {
        const container: Element = drawer.querySelector<HTMLDivElement>("#grammatical-genre-container")!;
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
                const rightLeaf: Element = document.querySelector("#right-leaf")!;
                rightLeaf.replaceChildren();
                await GrammaticalGenreUIBuilder.Form(drawer, gramGenre);
            });
            container.appendChild(thumbnail);
        });
    }

    public static async Form(drawer: Element, gramGenre?: GrammaticalGenre) {
        const rightLeaf: Element = document.querySelector("#right-leaf")!;
        rightLeaf.replaceChildren();
        const form: Element | undefined = await TemplateManager.LoadTemplateAsHTML("forms/grammatical-genre");
        if (!form) return;
        const inputName: HTMLInputElement = form.querySelector<HTMLInputElement>("#name")!;
        const inputId: HTMLInputElement = form.querySelector<HTMLInputElement>("#id")!;
        const submitButton: HTMLButtonElement = form.querySelector<HTMLButtonElement>("button")!;

        if (!gramGenre) {
            submitButton.innerText = "Créer un genre grammatical";
        } else {
            inputName.value = gramGenre.GetName();
            inputId.value = String(gramGenre.GetId());
            submitButton.innerText = "Mettre à jour le genre grammatical";
        }

        submitButton.addEventListener("click", async (event: Event) => {
            event.preventDefault();

            const gramGenre: GrammaticalGenre | undefined = new GrammaticalGenre(parseInt(inputId.value), inputName.value);
            if (!gramGenre.Validate()) return;
            gramGenre.Normalize();
            const [success, savedGenre] = await GrammaticalGenreService.Save(gramGenre);
            if (success && savedGenre) {
                const query: string = drawer.querySelector<HTMLInputElement>("#searchbar")!.value.toLowerCase();
                await GrammaticalGenreUIBuilder.List(drawer);
                await GrammaticalGenreUIBuilder.UpdateSearchbar(drawer, query);
                await GrammaticalGenreUIBuilder.Form(drawer, gramGenre ? gramGenre : undefined);
            }
        });

        rightLeaf.appendChild(form);
        if (gramGenre) await GrammaticalGenreUIBuilder.DeleteButton(drawer, gramGenre);
    }

    public static async CreateButton(drawer: Element) {
        const button: HTMLButtonElement = drawer.querySelector<HTMLButtonElement>("#create-button")!;
        button.addEventListener("click", async () => {
            const rightLeaf: Element = document.querySelector("#right-leaf")!;
            rightLeaf.replaceChildren();
            await GrammaticalGenreUIBuilder.Form(drawer);
        })
    }

    public static async DeleteButton(drawer: Element, gramGenre: GrammaticalGenre) {
        const rightLeaf: HTMLElement = document.querySelector("#right-leaf")!;
        const button: Element | undefined = await TemplateManager.LoadTemplateAsHTML("buttons/delete");
        if (!button) return;
        button.id = String(gramGenre.GetId());
        button.addEventListener("click", async () => {
            const success: boolean = await GrammaticalGenreService.Delete(gramGenre);
            if (success) {
                rightLeaf.replaceChildren();
                const query: string = drawer.querySelector<HTMLInputElement>("#searchbar")!.value.toLowerCase();
                await GrammaticalGenreUIBuilder.UpdateSearchbar(drawer, query);
            }
        });
        rightLeaf.appendChild(button);
    }
}