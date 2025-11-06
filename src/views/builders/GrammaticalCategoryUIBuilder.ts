import {GrammaticalCategory} from "../../database/models/GrammaticalCategory";
import {TemplateManager} from "../../utils/renderer/TemplateManager";
import {GrammaticalCategoryService} from "../../utils/renderer/services/GrammaticalCategoryService";
import {GrammaticalGenreUIBuilder} from "./GrammaticalGenreUIBuilder";
import {LanguageUIBuilder} from "./LanguageUIBuilder";
import {EntryUIBuilder} from "./EntryUIBuilder";

export class GrammaticalCategoryUIBuilder {
    public static isDrawerRevealed: boolean = false;
    private static leftLeaf: Element;
    private static rightLeaf: Element;

    public static async Initialize() {
        this.leftLeaf = document.querySelector("#left-leaf")!;
        this.rightLeaf = document.querySelector("#right-leaf")!;
        const drawerButton: HTMLButtonElement = document.querySelector<HTMLButtonElement>("#grammatical-category-drawer-button")!;
        drawerButton.addEventListener("click", async () => {
            GrammaticalCategoryUIBuilder.isDrawerRevealed = !GrammaticalCategoryUIBuilder.isDrawerRevealed;

            if (GrammaticalCategoryUIBuilder.isDrawerRevealed) {
                EntryUIBuilder.isDrawerRevealed = false;
                GrammaticalGenreUIBuilder.isDrawerRevealed = false;
                LanguageUIBuilder.isDrawerRevealed = false;
                await GrammaticalCategoryUIBuilder.Drawer();
            } else {
                this.leftLeaf.replaceChildren();
                this.leftLeaf.classList.add('hidden');
            }
        });
    }

    public static async Drawer() {
        this.leftLeaf.classList.remove('hidden');
        this.leftLeaf.replaceChildren();
        const drawer: Element | undefined = await TemplateManager.LoadTemplateAsHTML("drawers/grammatical-category");
        const gramCats: GrammaticalCategory[] = await GrammaticalCategoryService.ReadAll();
        if (!drawer) {
            return;
        } else {
            await GrammaticalCategoryUIBuilder.Searchbar(drawer);
            await GrammaticalCategoryUIBuilder.CreateButton(drawer);
            await GrammaticalCategoryUIBuilder.List(drawer, gramCats);
            this.leftLeaf.appendChild(drawer);
        }
    }

    public static async Searchbar(drawer: Element) {
        const searchbar: HTMLInputElement = drawer.querySelector<HTMLInputElement>("#searchbar")!;
        searchbar.addEventListener("input", async () => {
           const query: string = searchbar.value.toLowerCase();
           await GrammaticalCategoryUIBuilder.UpdateSearchbar(drawer, query);
        });
    }

    public static async UpdateSearchbar(drawer: Element, query: string) {
        const gramCats: GrammaticalCategory[] = await GrammaticalCategoryService.ReadAll();
        const filteredGramCats: GrammaticalCategory[] = gramCats.filter((gramCat: GrammaticalCategory) => {
            return [gramCat.GetName()].some(value => value.toLowerCase().includes(query));
        });
        await GrammaticalCategoryUIBuilder.List(drawer, filteredGramCats);
    }

    public static async List(drawer: Element, gramCats?: GrammaticalCategory[]) {
        const container: Element = drawer.querySelector("#grammatical-category-container")!;
        const thumbnailTemplate: Element | undefined = await TemplateManager.LoadTemplateAsHTML("thumbnails/grammatical-category");
        if (!thumbnailTemplate) return;
        container.replaceChildren();
        if (!gramCats) gramCats = await GrammaticalCategoryService.ReadAll();

        gramCats.forEach((gramCat: GrammaticalCategory) => {
            const thumbnail: Element = thumbnailTemplate.cloneNode(true) as Element;
            const thumbnailButton: HTMLButtonElement = thumbnail.querySelector<HTMLButtonElement>("button")!;
            thumbnailButton.id = String(gramCat.GetId());
            thumbnailButton.innerText = gramCat.GetName();
            thumbnailButton.addEventListener("click", async () => {
                this.rightLeaf.replaceChildren();
                await GrammaticalCategoryUIBuilder.Form(drawer, gramCat);
            });
            container.appendChild(thumbnail);
        });
    }

    public static async Form(drawer: Element, gramCat?: GrammaticalCategory) {
        this.rightLeaf.replaceChildren();
        const form: Element | undefined = await TemplateManager.LoadTemplateAsHTML("forms/grammatical-category");
        if (!form) return;
        const inputName: HTMLInputElement = form.querySelector<HTMLInputElement>("#name")!;
        const inputId: HTMLInputElement = form.querySelector<HTMLInputElement>("#id")!;
        const submitButton: HTMLButtonElement = form.querySelector<HTMLButtonElement>("button")!;

        if (!gramCat) {
            submitButton.innerText = "Créer une catégorie grammaticale";
        } else {
            inputName.value = gramCat.GetName();
            inputId.value = String(gramCat.GetId());
            submitButton.innerText = "Mettre à jour la catégorie grammaticale";
        }

        submitButton.addEventListener("click", async (event: Event) => {
            event.preventDefault();
            let [success, savedGrammaticalCategory]: [boolean, GrammaticalCategory | undefined] = await GrammaticalCategoryService.ProcessForm(form);
            if (success && savedGrammaticalCategory) {
                const query: string = drawer.querySelector<HTMLInputElement>("#searchbar")!.value.toLowerCase();
                await GrammaticalCategoryUIBuilder.List(drawer);
                await GrammaticalCategoryUIBuilder.UpdateSearchbar(drawer, query)
                await GrammaticalCategoryUIBuilder.Form(drawer, savedGrammaticalCategory ? savedGrammaticalCategory : undefined);
            }
        });

        this.rightLeaf.appendChild(form);
        if (gramCat) await GrammaticalCategoryUIBuilder.DeleteButton(drawer, gramCat);
    }

    public static async CreateButton(drawer: Element) {
        const button: HTMLButtonElement = drawer.querySelector<HTMLButtonElement>("#create-button")!;
        button.addEventListener("click", async () => {
            this.rightLeaf.replaceChildren();
            await GrammaticalCategoryUIBuilder.Form(drawer);
        });
    }

    public static async DeleteButton(drawer: Element, gramCat: GrammaticalCategory) {
        const button: Element | undefined = await TemplateManager.LoadTemplateAsHTML("buttons/delete");
        if (!button) return;
        button.id = String(gramCat.GetId());
        button.addEventListener("click", async () => {
            const success: boolean = await GrammaticalCategoryService.Delete(gramCat);
            if (success) {
                this.rightLeaf.replaceChildren();
                const query: string = drawer.querySelector<HTMLInputElement>("#searchbar")!.value.toLowerCase();
                await GrammaticalCategoryUIBuilder.UpdateSearchbar(drawer, query);
            }
        });
        this.rightLeaf.appendChild(button);
    }
}