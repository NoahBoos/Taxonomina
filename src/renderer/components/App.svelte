<script lang="ts">
    import {settings} from "@/renderer/stores/settingsStore";
    import {showDictionaryStore} from "@/renderer/stores/showDictionaryStore";
    import Navigator from "@/renderer/components/layouts/Navigator.svelte";
    import Inspector from "@/renderer/components/layouts/Inspector.svelte";
    import Browser from "@/renderer/components/layouts/Browser.svelte";
    import DictionaryModal from "@/renderer/components/features/dictionary/DictionaryModal.svelte";

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

<style lang="postcss">
    @reference '../styles/styles.css';

    #app {
        @apply flex flex-row p-4 gap-4 w-full h-screen bg-base-00 overflow-hidden;
    }

    #app :global(> *) {
        @apply text-base text-base-100 h-full border-transparent rounded-md shadow-md;
    }

    #app :global(*:focus) {
        @apply outline-none border-2 border-primary-500 bg-base-20;
    }

    #app :global(*:focus-visible) {
        @apply outline-none border-2 border-primary-500 bg-base-20;
    }
</style>

<div id="app">
    <Navigator />
    <Browser />
    <Inspector />
    {#if $showDictionaryStore}
        <DictionaryModal />
    {/if}
</div>