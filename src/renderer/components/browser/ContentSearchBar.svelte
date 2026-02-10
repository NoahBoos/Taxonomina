<script lang="ts">
    import {currentBrowserTabStore} from "@/renderer/stores/currentBrowserTabStore";
    import {PaginationUtils} from "@/renderer/utils/PaginationUtils";
    import {ContentType} from "@/renderer/enums/ContentType";

    let { query = $bindable(''), currentPage = $bindable(1) }: { query: string, currentPage: number } = $props();

    function handleInput() {
        currentPage = PaginationUtils.setPage(currentPage, 1);
    }
</script>

<style lang="postcss">
    @reference '../../styles/styles.css';

    .browser-searchbar {
        @apply text-base-100 placeholder-base-90 px-2 py-1 border-2 rounded-md border-base-40 bg-base-10 w-full transition-colors duration-250 ease-out;
    }

    .browser-searchbar:hover {
        @apply border-accent-500 bg-base-20;
    }
</style>

{#each ContentType.all as tab}
    {#if tab === $currentBrowserTabStore}
        <input type="text" placeholder="{ ContentType.searchbarLabels[tab] }" bind:value={ query } oninput={ handleInput } class="browser-searchbar" />
    {/if}
{/each}