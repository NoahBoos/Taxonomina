<script lang="ts">
    import {currentBrowserTabStore} from "@/renderer/stores/currentBrowserTabStore";
    import {PaginationUtils} from "@/renderer/utils/pagination";
    import {ContentTab} from "@/renderer/enums/ContentTab";

    let { query = $bindable(''), currentPage = $bindable(1) }: { query: string, currentPage: number } = $props();

    function handleInput() {
        currentPage = PaginationUtils.setPage(currentPage, 1);
    }
</script>

<style>

</style>

<div>
    {#each ContentTab.all as tab}
        {#if tab === $currentBrowserTabStore}
            <input type="text" placeholder="{ ContentTab.searchbarLabels[tab] }" bind:value={ query } oninput={ handleInput } />
        {/if}
    {/each}
</div>