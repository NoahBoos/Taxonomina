<script lang="ts">
    import Select from "@/renderer/components/ui/forms/Select.svelte";
    import {ELEMENTS_PER_PAGE, FONT_SIZES, THEME_VARIANTS, THEMES} from "@/renderer/utils/selectOptionPresets";
    import {settings, updateSetting} from "@/renderer/stores/settingsStore";
    import Toggle from "@/renderer/components/ui/interactive/Toggle.svelte";

    let theme = $state($settings!.selectedTheme ?? 'default');
    let theme_variant = $state($settings!.themeVariant ?? 'light');
    let font_size = $state($settings!.fontSize ?? 'base');
    let elements_per_page = $state($settings!.elementsPerPage.toString() ?? '20');
    let scrollbar_visibility = $state($settings!.scrollbarVisibility ?? true);
    let help_button_visibility = $state($settings!.helpButtonVisibility ?? true);
</script>

<style>

</style>

<div class="space-y-4">
    <h2>Paramètres</h2>
    <div class="space-y-2">
        <h3>Apparence</h3>
        <div class="flex flex-row gap-2">
            <Select label="Thème" options={ THEMES } bind:value={ theme } onChange={ () => { updateSetting("selectedTheme", theme) }} />
            <Select label="Variante" options={ THEME_VARIANTS } bind:value={ theme_variant } onChange={ () => { updateSetting("themeVariant", theme_variant) }} />
        </div>
    </div>
    <div class="space-y-2">
        <h3>Accessibilité</h3>
        <div class="flex flex-row gap-2">
            <Select label="Taille du texte" options={ FONT_SIZES } bind:value={ font_size } onChange={ () => { updateSetting("fontSize", font_size) }} />
            <Select label="Nombre d'éléments à afficher dans les navigateurs" options={ ELEMENTS_PER_PAGE } bind:value={ elements_per_page } onChange={ () => { updateSetting("elementsPerPage", Number(elements_per_page)) }} />
        </div>
        <div class="flex flex-row gap-2">
            <Toggle name="scrollbar_visibility" label="Afficher les barres de défilement" bind:checked={ scrollbar_visibility } onChange={ () => { updateSetting("scrollbarVisibility", scrollbar_visibility) }} />
            <Toggle name="help_button_visibility" label="Afficher le bouton d'aide" bind:checked={ help_button_visibility } onChange={ () => { updateSetting("helpButtonVisibility", help_button_visibility) }} />
        </div>
    </div>
</div>