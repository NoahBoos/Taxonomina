<script lang="ts">
    import {TabType} from "@/renderer/types/TabType";
    import {getTabIcon, getTabLabel} from "@/renderer/utils/tab";
    import {updateCurrentTab} from "@/renderer/stores/currentTabStore";

    export let tab: TabType;
    $: label = getTabLabel(tab);
    $: icon = getTabIcon(tab);
</script>

<style>

</style>

<button on:click={() => updateCurrentTab(tab)}>
    <svelte:component this={ icon } /> { label }
</button>