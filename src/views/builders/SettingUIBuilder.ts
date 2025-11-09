import {EntryUIBuilder} from "./EntryUIBuilder";
import {GrammaticalCategoryUIBuilder} from "./GrammaticalCategoryUIBuilder";
import {GrammaticalGenreUIBuilder} from "./GrammaticalGenreUIBuilder";
import {LanguageUIBuilder} from "./LanguageUIBuilder";
import {TemplateManager} from "../../utils/renderer/TemplateManager";
import {SettingService} from "../../utils/renderer/services/SettingService";

export class SettingUIBuilder {
    public static isDrawerRevealed: boolean = false;
    private static leftLeaf: Element;
    private static rightLeaf: Element;
    private static panel: Element;

    public static async Initialize() {
        this.leftLeaf = document.querySelector("#left-leaf")!;
        this.rightLeaf = document.querySelector("#right-leaf")!;
        const button: HTMLButtonElement = document.querySelector("#settings-window-button")!;
        button.addEventListener("click", async () => {
            SettingUIBuilder.isDrawerRevealed = !SettingUIBuilder.isDrawerRevealed;

            if (SettingUIBuilder.isDrawerRevealed) {
                EntryUIBuilder.isDrawerRevealed = false;
                GrammaticalCategoryUIBuilder.isDrawerRevealed = false;
                GrammaticalGenreUIBuilder.isDrawerRevealed = false;
                LanguageUIBuilder.isDrawerRevealed = false;
                await SettingUIBuilder.Panel();
            } else {
                this.leftLeaf.replaceChildren();
                this.leftLeaf.classList.add("hidden");
                this.rightLeaf.replaceChildren();
                this.rightLeaf.classList.add("hidden");
            }
        });
    }

    public static async Panel() {
        this.leftLeaf.replaceChildren();
        this.leftLeaf.classList.add("hidden");
        this.rightLeaf.replaceChildren();
        this.rightLeaf.classList.remove("hidden");
        const panel: Element | undefined = await TemplateManager.LoadTemplateAsHTML("settings");
        if (!panel) {
            return;
        } else {
            this.panel = panel;
            await this.ThemeVariantListener();
            await this.ThemeListener();
            this.rightLeaf.appendChild(panel);
        }
    }

    public static async ThemeVariantListener() {
        const select: HTMLSelectElement = SettingUIBuilder.panel.querySelector<HTMLSelectElement>('#theme-variant')!;
        select.addEventListener("change", async () => {
            await SettingService.ChangeThemeVariant(select.value);
        });
    }

    public static async ThemeListener() {
        const select: HTMLSelectElement = SettingUIBuilder.panel.querySelector<HTMLSelectElement>("#theme")!;
        select.addEventListener("change", async () => {
            await SettingService.ChangeTheme(select.value);
        })
    }
}