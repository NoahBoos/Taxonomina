<script lang="ts">
    import {ChevronRight} from "@lucide/svelte";
    import {PaginationUtils} from "@/renderer/utils/pagination";

    let { currentPage = $bindable(1), totalPages = $bindable(1) } = $props();
</script>

<style lang="postcss">
    @reference '../../../styles/styles.css';

    .next-page-button {
        @apply text-base-100 p-2 border-2 rounded-md border-primary-300 w-fit h-fit transition-colors duration-250 ease-out;
    }

    .next-page-button:hover {
        @apply text-base-90 border-primary-400 bg-primary-500;
    }
</style>

<button onclick={() => currentPage = PaginationUtils.next(currentPage, totalPages)} class="next-page-button">
    <ChevronRight />
</button>