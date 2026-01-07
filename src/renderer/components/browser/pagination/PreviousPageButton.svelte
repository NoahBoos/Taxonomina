<script lang="ts">
    import {ChevronLeft} from "@lucide/svelte";
    import {PaginationUtils} from "@/renderer/utils/pagination";

    let { currentPage = $bindable(1) } = $props();
</script>

<style>

</style>

<button onclick={() => currentPage = PaginationUtils.previous(currentPage)}>
    <ChevronLeft />
</button>