<script lang="ts">
    import {ContentType} from "@/renderer/enums/ContentType";
    import {getContext} from "svelte";
    import {CONTENT_TYPE_KEY} from "@/renderer/utils/symbols";
    import {PaginationUtils} from "@/renderer/utils/pagination";

    let { query = $bindable(''), currentPage = $bindable(1) }: { query: string, currentPage: number } = $props();

    let contentType: ContentType = getContext<ContentType>(CONTENT_TYPE_KEY);

    function handleInput() {
        currentPage = PaginationUtils.setPage(currentPage, 1);
    }
</script>

<style>

</style>

<div>
    {#each ContentType.all as type}
        {#if type === contentType}
            <input type="text" placeholder="{ ContentType.searchBarLabels[type] }" bind:value={ query } oninput={ handleInput } />
        {/if}
    {/each}
</div>