export class SettingService {
    public static async ChangeThemeVariant(variant: string) {
        document.body.setAttribute("data-variant", variant);
        await window.txnmAPI.settings.Update("themeVariant", variant);
    }

    public static async ChangeTheme(theme: string) {
        document.body.setAttribute("data-theme", theme);
        await window.txnmAPI.settings.Update("selectedTheme", theme);
    }

    public static async ChangeFontSize(fontSize: string) {
        document.body.setAttribute("data-font-size", fontSize);
        await window.txnmAPI.settings.Update("fontSize", fontSize);
    }
}