<script lang="ts">
    import {ChevronLeft} from "@lucide/svelte";
    import {PaginationUtils} from "@/renderer/utils/PaginationUtils";

    let { currentPage = $bindable(1) } = $props();
</script>

<style lang="postcss">
    @reference '../../../styles/styles.css';

    .previous-page-button {
        @apply text-base-100 p-2 border-2 rounded-md border-base-40 bg-base-10 w-fit h-fit transition-colors duration-250 ease-out;
    }

    .previous-page-button:hover {
        @apply border-accent-500 bg-accent-400/15;
    }
</style>

<button onclick={() => currentPage = PaginationUtils.previous(currentPage)} class="previous-page-button { currentPage === 1 ? 'opacity-0' : '' }">
    <ChevronLeft />
</button>