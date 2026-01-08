<script lang="ts">
    import {BrowserContentTab} from "@/renderer/types/BrowserContentTab";
    import {getTabIcon, getTabLabel} from "@/renderer/utils/tab";
    import {updateCurrentBrowserTab} from "@/renderer/stores/currentBrowserTabStore";

    export let tab: BrowserContentTab;
    $: label = getTabLabel(tab);
    $: icon = getTabIcon(tab);
</script>

<style>

</style>

<button on:click={() => updateCurrentBrowserTab(tab)}>
    <svelte:component this={ icon } /> { label }
</button>