import {Language} from "../../database/models/Language";
import {TemplateManager} from "../../utils/renderer/TemplateManager";
import {LanguageService} from "../../utils/renderer/services/LanguageService";
import {GrammaticalCategoryUIBuilder} from "./GrammaticalCategoryUIBuilder";
import {GrammaticalGenreUIBuilder} from "./GrammaticalGenreUIBuilder";
import {EntryUIBuilder} from "./EntryUIBuilder";

export class LanguageUIBuilder {
    public static isDrawerRevealed: boolean = false;

    public static async Initialize() {
        const button: HTMLButtonElement = document.querySelector("#language-drawer-button")!;
        button.addEventListener("click", async () => {
            LanguageUIBuilder.isDrawerRevealed = !LanguageUIBuilder.isDrawerRevealed;

            if (LanguageUIBuilder.isDrawerRevealed) {
                EntryUIBuilder.isDrawerRevealed = false;
                GrammaticalCategoryUIBuilder.isDrawerRevealed = false;
                GrammaticalGenreUIBuilder.isDrawerRevealed = false;
                await LanguageUIBuilder.Drawer();
            } else {
                document.querySelector("#left-leaf")!.replaceChildren();
                document.querySelector("#right-leaf")!.replaceChildren();
            }
        });
    }

    public static async Drawer() {
        const leftLeaf: Element = document.querySelector("#left-leaf")!;
        leftLeaf.replaceChildren();
        const drawer: Element | undefined = await TemplateManager.LoadTemplateAsHTML("drawers/language");
        if (!drawer) return;
        await LanguageUIBuilder.Searchbar(drawer);
        await LanguageUIBuilder.CreateButton(drawer);
        await LanguageUIBuilder.List(drawer);
        leftLeaf.appendChild(drawer);
    }

    public static async Searchbar(drawer: Element) {
        const searchbar: HTMLInputElement = drawer.querySelector("#searchbar")!;
        searchbar.addEventListener("input", async () => {
            const query: string = searchbar.value.toLowerCase();
            await LanguageUIBuilder.UpdateSearchbar(drawer, query);
        });
    }

    public static async UpdateSearchbar(drawer: Element, query: string) {
        const languages: Language[] = await LanguageService.ReadAll();
        const filteredLanguages: Language[] = languages.filter(loopedLanguage => {
            return [loopedLanguage.GetIso639_1(), loopedLanguage.GetIso639_3(), loopedLanguage.GetNameNative(), loopedLanguage.GetNameLocal()]
                .some(value => value.toLowerCase().includes(query.toLowerCase()));
        });
        await LanguageUIBuilder.List(drawer, filteredLanguages);
    }

    public static async List(drawer: Element, languages?: Language[]) {
        const container: Element = drawer.querySelector("#language-container")!;
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
                await LanguageUIBuilder.Form(drawer, language);
            });

            container.appendChild(thumbnail);
        });
    }

    public static async Form(drawer: Element, language?: Language) {
        const rightLeaf: Element = document.querySelector("#right-leaf")!;
        rightLeaf.replaceChildren();
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
                const query: string = drawer.querySelector<HTMLInputElement>("#searchbar")!.value.toLowerCase();
                await LanguageUIBuilder.List(drawer);
                await LanguageUIBuilder.UpdateSearchbar(drawer, query);
                await LanguageUIBuilder.Form(drawer, savedLanguage ? savedLanguage : undefined);
            }
        });

        rightLeaf.appendChild(form);
        if (language) await LanguageUIBuilder.DeleteButton(drawer, language);
    }

    public static async CreateButton(drawer: Element) {
        const button: HTMLButtonElement = drawer.querySelector("#create-button")!;
        button.addEventListener("click", async () => {
            document.querySelector("#right-leaf")!.replaceChildren();
            await LanguageUIBuilder.Form(drawer);
        })
    }

    public static async DeleteButton(drawer: Element, language: Language) {
        const rightLeaf: HTMLElement = document.querySelector("#right-leaf")!;
        const button: Element | undefined = await TemplateManager.LoadTemplateAsHTML("buttons/delete");
        if (!button) return;
        button.id = String(language.GetId());
        button.addEventListener("click", async () => {
            const success: boolean = await LanguageService.Delete(language);
            if (success) {
                rightLeaf.replaceChildren();
                const query: string = drawer.querySelector<HTMLInputElement>("#searchbar")!.value.toLowerCase();
                await LanguageUIBuilder.UpdateSearchbar(drawer, query);
            }
        });
        rightLeaf.appendChild(button);
    }
}