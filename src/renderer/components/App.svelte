<script lang="ts">
    import {settings} from "@/renderer/stores/settingsStore";
    import Navigator from "@/renderer/components/layouts/Navigator.svelte";
    import Inspector from "@/renderer/components/layouts/Inspector.svelte";
    import Browser from "@/renderer/components/layouts/Browser.svelte";

    $effect(() => {
        const theme = $settings!.selectedTheme ?? 'default';
        const theme_variant = $settings!.themeVariant ?? 'light';

        document.body.setAttribute('data-theme', theme);
        document.body.setAttribute('data-theme-variant', theme_variant);
    })
</script>

<style>
    #app {
        @apply flex flex-row w-full h-screen overflow-hidden;
    }
</style>

<div id="app">
    <Navigator />
    <Browser />
    <Inspector />
</div>