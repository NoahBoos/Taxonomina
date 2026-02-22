<script lang="ts">
    import {ChevronRight} from "@lucide/svelte";
    import {PaginationUtils} from "@/renderer/utils/PaginationUtils";

    let { currentPage = $bindable(1), totalPages = $bindable(1) } = $props();
</script>

<style lang="postcss">
    @reference '../../../styles/styles.css';

    .next-page-button {
        @apply text-base-100 p-2 border-2 rounded-md border-base-40 bg-base-10 w-fit h-fit transition-colors duration-250 ease-out;
    }

    .next-page-button:hover {
        @apply border-accent-500 bg-accent-400/15;
    }
</style>

<button onclick={() => currentPage = PaginationUtils.next(currentPage, totalPages)} class="next-page-button  { currentPage === totalPages ? 'opacity-0' : '' }">
    <ChevronRight />
</button>