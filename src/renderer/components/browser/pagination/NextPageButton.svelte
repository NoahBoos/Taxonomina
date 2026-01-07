<script lang="ts">
    import {ChevronRight} from "@lucide/svelte";
    import {PaginationUtils} from "@/renderer/utils/pagination";

    let { currentPage = $bindable(1), totalPages = $bindable(1) } = $props();
</script>

<style>

</style>

<button onclick={() => currentPage = PaginationUtils.next(currentPage, totalPages)}>
    <ChevronRight />
</button>