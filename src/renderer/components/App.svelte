<script lang="ts">
    import {settings} from "@/renderer/stores/settingsStore";
    import Navigator from "@/renderer/components/layouts/Navigator.svelte";
    import Inspector from "@/renderer/components/layouts/Inspector.svelte";
    import Browser from "@/renderer/components/layouts/Browser.svelte";

    $effect(() => {
        const theme = $settings!.selectedTheme ?? 'default';
        const theme_variant = $settings!.themeVariant ?? 'light';
        const font_size = $settings!.fontSize ?? 'base';
        const scrollbar_visibility = $settings!.scrollbarVisibility ?? true;

        document.body.setAttribute('data-theme', theme);
        document.body.setAttribute('data-theme-variant', theme_variant);
        document.body.setAttribute('data-font-size', font_size);
        document.body.setAttribute('data-scrollbar-visibility', scrollbar_visibility.toString());
    });
</script>

<style>
    #app {
        @apply flex flex-row w-full h-screen overflow-hidden;
    }

    #app :global(> *) {
        @apply h-screen;
    }
</style>

<div id="app">
    <Navigator />
    <Browser />
    <Inspector />
</div>