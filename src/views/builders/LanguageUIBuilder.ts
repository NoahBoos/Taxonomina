import {Language} from "../../database/models/Language";
import {TemplateManager} from "../../utils/renderer/TemplateManager";
import {LanguageService} from "../../utils/renderer/services/LanguageService";
import {GrammaticalCategoryUIBuilder} from "./GrammaticalCategoryUIBuilder";
import {GrammaticalGenreUIBuilder} from "./GrammaticalGenreUIBuilder";
import {EntryUIBuilder} from "./EntryUIBuilder";

export class LanguageUIBuilder {
    public static isDrawerRevealed: boolean = false;
    private static leftLeaf: Element;
    private static rightLeaf: Element;
    private static drawer: Element;

    public static async Initialize() {
        this.leftLeaf = document.querySelector("#left-leaf")!;
        this.rightLeaf = document.querySelector("#right-leaf")!;
        const button: HTMLButtonElement = document.querySelector("#language-drawer-button")!;
        button.addEventListener("click", async () => {
            LanguageUIBuilder.isDrawerRevealed = !LanguageUIBuilder.isDrawerRevealed;

            if (LanguageUIBuilder.isDrawerRevealed) {
                EntryUIBuilder.isDrawerRevealed = false;
                GrammaticalCategoryUIBuilder.isDrawerRevealed = false;
                GrammaticalGenreUIBuilder.isDrawerRevealed = false;
                await LanguageUIBuilder.Drawer();
            } else {
                this.leftLeaf.replaceChildren();
                this.leftLeaf.classList.add('hidden');
            }
        });
    }

    public static async Drawer() {
        this.leftLeaf.classList.remove('hidden');
        this.leftLeaf.replaceChildren();
        const drawer: Element | undefined = await TemplateManager.LoadTemplateAsHTML("drawers/language");
        if (!drawer) {
            return;
        } else {
            this.drawer = drawer;
            await LanguageUIBuilder.Searchbar();
            await LanguageUIBuilder.CreateButton();
            await LanguageUIBuilder.List();
            this.leftLeaf.appendChild(this.drawer);
        }
    }

    public static async Searchbar() {
        const searchbar: HTMLInputElement = this.drawer.querySelector("#searchbar")!;
        searchbar.addEventListener("input", async () => {
            const query: string = searchbar.value.toLowerCase();
            await LanguageUIBuilder.UpdateSearchbar(query);
        });
    }

    public static async UpdateSearchbar(query: string) {
        const languages: Language[] = await LanguageService.ReadAll();
        const filteredLanguages: Language[] = languages.filter(loopedLanguage => {
            return [loopedLanguage.GetIso639_1(), loopedLanguage.GetIso639_3(), loopedLanguage.GetNameNative(), loopedLanguage.GetNameLocal()]
                .some(value => value.toLowerCase().includes(query.toLowerCase()));
        });
        await LanguageUIBuilder.List(filteredLanguages);
    }

    public static async List(languages?: Language[]) {
        const container: Element = this.drawer.querySelector("#language-container")!;
        const template: Element | undefined = await TemplateManager.LoadTemplateAsHTML("thumbnails/language");
        if (!template) return;
        container.replaceChildren();
        if (!languages) languages = await LanguageService.ReadAll();

        languages.forEach((language: Language) => {
            const thumbnail: Element = template.cloneNode(true) as Element;
            const button: HTMLButtonElement = thumbnail.querySelector('[data-role="thumbnail-button"]')!;

            button.id = String(language.GetId());
            button.querySelector('[data-role="thumbnail-name_native"]')!.textContent = language.GetNameNative();
            button.querySelector('[data-role="thumbnail-name_local"]')!.textContent = language.GetNameLocal();

            button.addEventListener("click", async (event: Event) => {
                event.preventDefault();
                document.querySelector('#right-leaf')!.replaceChildren();
                await LanguageUIBuilder.Form(language);
            });

            container.appendChild(thumbnail);
        });
    }

    public static async Form(language?: Language) {
        this.rightLeaf.replaceChildren();
        const form: Element | undefined = await TemplateManager.LoadTemplateAsHTML("forms/language");
        if (!form) return;
        const inputISO6391: HTMLInputElement = form.querySelector<HTMLInputElement>("#iso_639_1")!;
        const inputISO6393: HTMLInputElement = form.querySelector<HTMLInputElement>("#iso_639_3")!;
        const inputIsConlang: HTMLInputElement = form.querySelector<HTMLInputElement>("#is_conlang")!;
        const inputNameNative: HTMLInputElement = form.querySelector<HTMLInputElement>("#name_native")!;
        const inputNameLocal: HTMLInputElement = form.querySelector<HTMLInputElement>("#name_local")!;
        const inputDirection: HTMLInputElement = form.querySelector<HTMLInputElement>("#direction")!;
        const inputId: HTMLInputElement = form.querySelector<HTMLInputElement>("#id")!;
        const button: HTMLButtonElement = form.querySelector<HTMLButtonElement>("button#submit")!;

        if (!language) {
            button.innerText = "Créer une langue";
        } else {
            inputISO6391.value = language.GetIso639_1();
            inputISO6393.value = language.GetIso639_3();
            inputIsConlang.checked = language.GetIsConlang();
            inputNameNative.value = language.GetNameNative();
            inputNameLocal.value = language.GetNameLocal();
            inputDirection.value = language.GetDirection();
            inputId.value = String(language.GetId());
            button.innerText = "Mettre à jour la langue";
        }

        button.addEventListener("click", async (event: Event) => {
            event.preventDefault();
            let [success, savedLanguage]: [boolean, Language | undefined] = await LanguageService.ProcessForm(form);
            if (success && savedLanguage) {
                const query: string = this.drawer.querySelector<HTMLInputElement>("#searchbar")!.value.toLowerCase();
                await LanguageUIBuilder.List();
                await LanguageUIBuilder.UpdateSearchbar(query);
                await LanguageUIBuilder.Form(savedLanguage ? savedLanguage : undefined);
            }
        });

        this.rightLeaf.appendChild(form);
        if (language) await LanguageUIBuilder.DeleteButton(language);
    }

    public static async CreateButton() {
        const button: HTMLButtonElement = this.drawer.querySelector("#create-button")!;
        button.addEventListener("click", async () => {
            document.querySelector("#right-leaf")!.replaceChildren();
            await LanguageUIBuilder.Form();
        })
    }

    public static async DeleteButton(language: Language) {
        const button: Element | undefined = await TemplateManager.LoadTemplateAsHTML("buttons/delete");
        if (!button) return;
        button.id = String(language.GetId());
        button.addEventListener("click", async () => {
            const success: boolean = await LanguageService.Delete(language);
            if (success) {
                this.rightLeaf.replaceChildren();
                const query: string = this.drawer.querySelector<HTMLInputElement>("#searchbar")!.value.toLowerCase();
                await LanguageUIBuilder.UpdateSearchbar(query);
            }
        });
        this.rightLeaf.appendChild(button);
    }
}