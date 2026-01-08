<script lang="ts">
    import {currentBrowserTabStore} from "@/renderer/stores/currentBrowserTabStore";
    import {PaginationUtils} from "@/renderer/utils/pagination";
    import {ContentType} from "@/renderer/enums/ContentType";

    let { query = $bindable(''), currentPage = $bindable(1) }: { query: string, currentPage: number } = $props();

    function handleInput() {
        currentPage = PaginationUtils.setPage(currentPage, 1);
    }
</script>

<style>

</style>

<div>
    {#each ContentType.all as tab}
        {#if tab === $currentBrowserTabStore}
            <input type="text" placeholder="{ ContentType.searchbarLabels[tab] }" bind:value={ query } oninput={ handleInput } />
        {/if}
    {/each}
</div>