<script lang="ts">
    import Select from "@/renderer/components/ui/forms/Select.svelte";
    import {ELEMENTS_PER_PAGE, FONT_SIZES, THEME_VARIANTS, THEMES} from "@/renderer/utils/selectOptionPresets";
    import {settings, updateSetting} from "@/renderer/stores/settingsStore";

    let theme = $state($settings!.selectedTheme ?? 'default');
    let theme_variant = $state($settings!.themeVariant ?? 'light');
    let font_size = $state($settings!.fontSize ?? 'base');
    let elements_per_page = $state($settings!.elementsPerPage.toString() ?? '20');
</script>

<style>

</style>

<div>
    <h3>Paramètres</h3>
    <div>
        <div>
            <h3>Apparence</h3>
            <Select label="Thème" options={ THEMES } bind:value={ theme } onChange={ () => { updateSetting("selectedTheme", theme) }} />
            <Select label="Variante" options={ THEME_VARIANTS } bind:value={ theme_variant } onChange={ () => { updateSetting("themeVariant", theme_variant) }} />
        </div>
        <div>
            <h3>Accessibilité</h3>
            <Select label="Taille du texte" options={ FONT_SIZES } bind:value={ font_size } onChange={ () => { updateSetting("fontSize", font_size) }} />
            <Select label="Nombre d'éléments à afficher dans les navigateurs" options={ ELEMENTS_PER_PAGE } bind:value={ elements_per_page } onChange={ () => { updateSetting("elementsPerPage", elements_per_page) }} />
        </div>
    </div>
</div>