<script lang="ts">
    let { currentPage = $bindable(1), totalPages, elementsPerPage } = $props();
</script>

<style>

</style>

<div>
    {#if totalPages === 0}
        <p class="text-center">Aucun élément à afficher.</p>
    {:else}
        <p class="text-center">{ currentPage } / { totalPages }</p>
        <p class="text-center">{ elementsPerPage } éléments affichés.</p>
    {/if}
</div>