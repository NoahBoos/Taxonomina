<script lang="ts">
    let { currentPage = $bindable(1), totalPages, elementsPerPage } = $props();
</script>

<style>

</style>

<div>
    {#if totalPages === 0}
        <p>Aucun élément à afficher.</p>
    {:else}
        <p>{ currentPage } / { totalPages }</p>
        <p>{ elementsPerPage } éléments affichés.</p>
    {/if}
</div>