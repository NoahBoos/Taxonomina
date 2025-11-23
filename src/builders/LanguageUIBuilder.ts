import {Language} from "../database/models/Language";
import {TemplateManager} from "../utils/renderer/TemplateManager";
import {LanguageService} from "../services/LanguageService";
import {GrammaticalCategoryUIBuilder} from "./GrammaticalCategoryUIBuilder";
import {GrammaticalGenreUIBuilder} from "./GrammaticalGenreUIBuilder";
import {EntryUIBuilder} from "./EntryUIBuilder";
import {SettingUIBuilder} from "./SettingUIBuilder";
import * as sea from "node:sea";
import {GetSettings} from "../views/pages/index/renderer";

export class LanguageUIBuilder {
    public static isDrawerRevealed: boolean = false;
    private static thumbnailTemplate: Element | undefined = undefined;
    private static leftLeaf: Element;
    private static rightLeaf: Element;
    private static drawer: Element;
    private static languages: Language[] = [];
    private static previousPageButton: HTMLButtonElement;
    private static nextPageButton: HTMLButtonElement;
    private static currentPage: number = 1;
    public static pageSize: number = 25;
    private static totalPages: number = 1;

    public static async Initialize() {
        LanguageUIBuilder.leftLeaf = document.querySelector("#left-leaf")!;
        LanguageUIBuilder.rightLeaf = document.querySelector("#right-leaf")!;
        const button: HTMLButtonElement = document.querySelector("#language-drawer-button")!;
        button.addEventListener("click", async (event: Event) => {
            event.preventDefault();
            LanguageUIBuilder.isDrawerRevealed = !LanguageUIBuilder.isDrawerRevealed;

            if (LanguageUIBuilder.isDrawerRevealed) {
                EntryUIBuilder.isDrawerRevealed = false;
                GrammaticalCategoryUIBuilder.isDrawerRevealed = false;
                GrammaticalGenreUIBuilder.isDrawerRevealed = false;
                SettingUIBuilder.isPanelRevealed = false;
                await LanguageUIBuilder.RenderDrawer();
            } else {
                LanguageUIBuilder.leftLeaf.replaceChildren();
                LanguageUIBuilder.leftLeaf.classList.add('hidden');
            }
        });
    }

    public static async RenderDrawer() {
        LanguageUIBuilder.leftLeaf.classList.remove('hidden');
        LanguageUIBuilder.leftLeaf.replaceChildren();
        const drawer: Element | undefined = await TemplateManager.LoadTemplateAsHTML("drawers/language");
        if (!drawer) {
            return;
        } else {
            LanguageUIBuilder.drawer = drawer;
            LanguageUIBuilder.previousPageButton = this.drawer.querySelector("#previous-page-button")!;
            LanguageUIBuilder.nextPageButton = this.drawer.querySelector("#next-page-button")!;
            LanguageUIBuilder.languages = await LanguageService.ReadAll(GetSettings().currentDictionary);
            await LanguageUIBuilder.RenderSearchbar();
            await LanguageUIBuilder.RenderCreateButton();
            await LanguageUIBuilder.RenderList();
            await LanguageUIBuilder.HandlePaginationControls();
            await LanguageUIBuilder.RenderPaginationControls();
            LanguageUIBuilder.leftLeaf.appendChild(LanguageUIBuilder.drawer);
        }
    }

    public static async RenderSearchbar() {
        const searchbar: HTMLInputElement = LanguageUIBuilder.drawer.querySelector("#searchbar")!;
        searchbar.addEventListener("input", async () => {
            LanguageUIBuilder.currentPage = 1;
            LanguageUIBuilder.languages = await LanguageService.FilterBySearch(GetSettings().currentDictionary, searchbar.value);
            await LanguageUIBuilder.RenderList();
        });
    }

    public static async RenderList() {
        const container: Element = LanguageUIBuilder.drawer.querySelector("#language-container")!;
        LanguageUIBuilder.thumbnailTemplate = await TemplateManager.LoadTemplateAsHTML("thumbnails/language");
        container.replaceChildren();
        if (!LanguageUIBuilder.languages) LanguageUIBuilder.languages = await LanguageService.ReadAll(GetSettings().currentDictionary);

        LanguageUIBuilder.totalPages = Math.ceil(LanguageUIBuilder.languages.length / LanguageUIBuilder.pageSize);
        const startIndex: number = (LanguageUIBuilder.currentPage - 1) * LanguageUIBuilder.pageSize;
        const endIndex: number = Math.min(startIndex + LanguageUIBuilder.pageSize, LanguageUIBuilder.languages.length);

        const paginatedLanguages: Language[] = LanguageUIBuilder.languages.slice(startIndex, endIndex);

        paginatedLanguages.forEach(language => {
            LanguageUIBuilder.RenderThumbnail(container, language);
        });

        await LanguageUIBuilder.RenderPageCounter();
        await LanguageUIBuilder.RenderPaginationControls();
    }

    public static RenderThumbnail(container: Element, language: Language) {
        const thumbnail = LanguageUIBuilder.thumbnailTemplate?.cloneNode(true) as Element;
        const button: HTMLButtonElement = thumbnail.querySelector('button')!;
        button.querySelector('[data-role="thumbnail-name_native"]')!.textContent = language.GetNameNative();
        button.querySelector('[data-role="thumbnail-name_local"]')!.textContent = language.GetNameLocal();
        button.addEventListener("click", async (event: Event) => {
            event.preventDefault();
            await LanguageUIBuilder.RenderForm(language);
        });
        container.appendChild(thumbnail);
    }

    public static async RenderForm(language?: Language) {
        LanguageUIBuilder.rightLeaf.replaceChildren();
        const form: Element | undefined = await TemplateManager.LoadTemplateAsHTML("forms/language");
        if (!form) return;

        const title: HTMLHeadingElement = form.querySelector<HTMLHeadingElement>('[data-role="form-title"]')!;
        const inputISO6391: HTMLInputElement = form.querySelector<HTMLInputElement>("#iso_639_1")!;
        const inputISO6393: HTMLInputElement = form.querySelector<HTMLInputElement>("#iso_639_3")!;
        const inputIsConlang: HTMLInputElement = form.querySelector<HTMLInputElement>("#is_conlang")!;
        const inputNameNative: HTMLInputElement = form.querySelector<HTMLInputElement>("#name_native")!;
        const inputNameLocal: HTMLInputElement = form.querySelector<HTMLInputElement>("#name_local")!;
        const inputDirection: HTMLInputElement = form.querySelector<HTMLInputElement>("#direction")!;
        const inputId: HTMLInputElement = form.querySelector<HTMLInputElement>("#id")!;
        const button: HTMLButtonElement = form.querySelector<HTMLButtonElement>("button#submit")!;

        if (!language) {
            title.textContent = "Création - Langue";
            button.innerText = "Créer";
        } else {
            title.textContent = "Modification - " + language.GetNameLocal();
            inputISO6391.value = language.GetIso639_1();
            inputISO6393.value = language.GetIso639_3();
            inputIsConlang.checked = language.GetIsConlang();
            inputNameNative.value = language.GetNameNative();
            inputNameLocal.value = language.GetNameLocal();
            inputDirection.value = language.GetDirection();
            inputId.value = String(language.GetId());
            button.innerText = "Mettre à jour";
        }

        button.addEventListener("click", async (event: Event) => {
            event.preventDefault();
            let [success, savedLanguage]: [boolean, Language | undefined] = await LanguageService.ProcessForm(form);
            if (success && savedLanguage) {
                const query: string = LanguageUIBuilder.drawer.querySelector<HTMLInputElement>("#searchbar")!.value.toLowerCase();
                LanguageUIBuilder.languages = await LanguageService.FilterBySearch(GetSettings().currentDictionary, query);
                await LanguageUIBuilder.RenderList();
                await LanguageUIBuilder.RenderForm(savedLanguage ? savedLanguage : undefined);
            }
        });

        LanguageUIBuilder.rightLeaf.appendChild(form);
        if (language) await LanguageUIBuilder.RenderDeleteButton(language);
    }

    public static async RenderCreateButton() {
        const button: HTMLButtonElement = LanguageUIBuilder.drawer.querySelector("#create-button")!;
        button.addEventListener("click", async (event: Event) => {
            event.preventDefault();
            LanguageUIBuilder.rightLeaf.replaceChildren();
            await LanguageUIBuilder.RenderForm();
        })
    }

    public static async RenderDeleteButton(language: Language) {
        const button: Element | undefined = await TemplateManager.LoadTemplateAsHTML("buttons/delete");
        if (!button) return;
        button.id = String(language.GetId());
        button.addEventListener("click", async (event: Event) => {
            event.preventDefault();
            const success: boolean = await LanguageService.Delete(language);
            if (success) {
                LanguageUIBuilder.rightLeaf.replaceChildren();
                const query: string = LanguageUIBuilder.drawer.querySelector<HTMLInputElement>("#searchbar")!.value.toLowerCase();
                LanguageUIBuilder.languages = await LanguageService.FilterBySearch(GetSettings().currentDictionary, query);
                await LanguageUIBuilder.RenderList();
            }
        });
        LanguageUIBuilder.rightLeaf.appendChild(button);
    }

    public static async RenderPreviousPage() {
        if (LanguageUIBuilder.currentPage > 1) {
            LanguageUIBuilder.currentPage--;
            await LanguageUIBuilder.RenderList();
        }
    }

    public static async RenderNextPage() {
        if (LanguageUIBuilder.currentPage < LanguageUIBuilder.totalPages) {
            LanguageUIBuilder.currentPage++;
            await LanguageUIBuilder.RenderList();
        }
    }

    public static async HandlePaginationControls() {
        LanguageUIBuilder.previousPageButton.addEventListener("click", async (event: Event) => {
            event.preventDefault();
            await LanguageUIBuilder.RenderPreviousPage();
            await LanguageUIBuilder.RenderPaginationControls();
        });
        LanguageUIBuilder.nextPageButton.addEventListener("click", async (event: Event) => {
            event.preventDefault();
            await LanguageUIBuilder.RenderNextPage()
            await LanguageUIBuilder.RenderPaginationControls();
        });
    }

    public static async RenderPaginationControls() {
        if (LanguageUIBuilder.currentPage === 1 || LanguageUIBuilder.totalPages == 1) LanguageUIBuilder.previousPageButton.classList.add("invisible");
        else LanguageUIBuilder.previousPageButton.classList.remove("invisible");
        if (LanguageUIBuilder.currentPage === LanguageUIBuilder.totalPages || LanguageUIBuilder.totalPages == 1) LanguageUIBuilder.nextPageButton.classList.add("invisible");
        else LanguageUIBuilder.nextPageButton.classList.remove("invisible");
    }

    public static async RenderPageCounter() {
        const pageCounter: HTMLParagraphElement = this.drawer.querySelector("#page-counter")!;
        const elementCounter: HTMLParagraphElement = this.drawer.querySelector("#element-counter")!;
        pageCounter.textContent = String(LanguageUIBuilder.totalPages >= 1 ? LanguageUIBuilder.currentPage : 0) + "/" + String(LanguageUIBuilder.totalPages);
        elementCounter.textContent = String(LanguageUIBuilder.pageSize + " Éléments affichés.");
    }
}