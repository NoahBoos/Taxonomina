<script lang="ts">
    import {TabType} from "@/renderer/types/TabType";
    import {getTabLabel} from "@/renderer/utils/tab";
    import {updateCurrentTab} from "@/renderer/stores/currentTabStore";

    export let tab: TabType;
    $: label = getTabLabel(tab);
</script>

<style>

</style>

<button on:click={() => updateCurrentTab(tab)}>
    { label }
</button>