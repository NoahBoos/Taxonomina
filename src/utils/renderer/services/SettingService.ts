export class SettingService {
    public static async ChangeThemeVariant(variant: string) {
        document.body.setAttribute("data-variant", variant);
        await window.txnmAPI.settings.Update("themeVariant", variant);
    }

    public static async ChangeTheme(theme: string) {
        document.body.setAttribute("data-theme", theme);
        await window.txnmAPI.settings.Update("selectedTheme", theme);
    }
}