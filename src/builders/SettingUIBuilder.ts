import {EntryUIBuilder} from "./EntryUIBuilder";
import {GrammaticalCategoryUIBuilder} from "./GrammaticalCategoryUIBuilder";
import {GrammaticalGenreUIBuilder} from "./GrammaticalGenreUIBuilder";
import {LanguageUIBuilder} from "./LanguageUIBuilder";
import {TemplateManager} from "../utils/renderer/TemplateManager";
import {SettingService} from "../services/SettingService";
import {TaxonominaSettings} from "../interfaces/I_TaxonominaSettings";

export class SettingUIBuilder {
    private static settings: TaxonominaSettings;
    public static isPanelRevealed: boolean = false;
    private static leftLeaf: Element;
    private static rightLeaf: Element;
    private static panel: Element;

    public static async Initialize() {
        SettingUIBuilder.settings = await window.txnmAPI.settings.Expose();
        SettingUIBuilder.leftLeaf = document.querySelector("#left-leaf")!;
        SettingUIBuilder.rightLeaf = document.querySelector("#right-leaf")!;
        const button: HTMLButtonElement = document.querySelector("#settings-window-button")!;
        button.addEventListener("click", async () => {
            SettingUIBuilder.isPanelRevealed = !SettingUIBuilder.isPanelRevealed;

            if (SettingUIBuilder.isPanelRevealed) {
                EntryUIBuilder.isDrawerRevealed = false;
                GrammaticalCategoryUIBuilder.isDrawerRevealed = false;
                GrammaticalGenreUIBuilder.isDrawerRevealed = false;
                LanguageUIBuilder.isDrawerRevealed = false;
                await SettingUIBuilder.Panel();
            } else {
                SettingUIBuilder.leftLeaf.replaceChildren();
                SettingUIBuilder.leftLeaf.classList.add("hidden");
                SettingUIBuilder.rightLeaf.replaceChildren();
                SettingUIBuilder.rightLeaf.classList.add("hidden");
            }
        });
    }

    public static async Panel() {
        SettingUIBuilder.settings = await window.txnmAPI.settings.Expose();
        SettingUIBuilder.leftLeaf.replaceChildren();
        SettingUIBuilder.leftLeaf.classList.add("hidden");
        SettingUIBuilder.rightLeaf.replaceChildren();
        SettingUIBuilder.rightLeaf.classList.remove("hidden");
        const panel: Element | undefined = await TemplateManager.LoadTemplateAsHTML("settings");
        if (!panel) {
            return;
        } else {
            this.panel = panel;
            await this.ThemeVariantSelect();
            await this.ThemeSelect();
            await this.FontSizeSelect();
            await this.ScrollbarVisibilityToggle();
            await this.HelpButtonVisibilityToggle();
            this.rightLeaf.appendChild(panel);
        }
    }

    public static async ThemeVariantSelect() {
        const select: HTMLSelectElement = SettingUIBuilder.panel.querySelector<HTMLSelectElement>('#theme-variant')!;
        select.value = SettingUIBuilder.settings.themeVariant;
        select.addEventListener("change", async () => {
            await SettingService.ChangeThemeVariant(select.value);
        });
    }

    public static async ThemeSelect() {
        const select: HTMLSelectElement = SettingUIBuilder.panel.querySelector<HTMLSelectElement>("#theme")!;
        select.value = SettingUIBuilder.settings.selectedTheme;
        select.addEventListener("change", async () => {
            await SettingService.ChangeTheme(select.value);
        });
    }

    public static async FontSizeSelect() {
        const select: HTMLSelectElement = SettingUIBuilder.panel.querySelector<HTMLSelectElement>("#font-size")!;
        select.value = SettingUIBuilder.settings.fontSize;
        select.addEventListener("change", async () => {
            await SettingService.ChangeFontSize(select.value);
        });
    }

    public static async ScrollbarVisibilityToggle() {
        const toggle: HTMLInputElement = SettingUIBuilder.panel.querySelector<HTMLInputElement>("input#scrollbar-visibility")!;
        toggle.checked = SettingUIBuilder.settings.scrollbarVisibility;
        toggle.addEventListener("change", async () => {
            await SettingService.ChangeScrollbarVisibility(toggle.checked);
        });
    }

    public static async HelpButtonVisibilityToggle() {
        const toggle: HTMLInputElement = SettingUIBuilder.panel.querySelector<HTMLInputElement>("input#help-button-visibility")!;
        toggle.checked = SettingUIBuilder.settings.helpButtonVisibility;
        toggle.addEventListener("change", async () => {
            await SettingService.ChangeHelpButtonVisibility(toggle.checked);
        });
    }
}