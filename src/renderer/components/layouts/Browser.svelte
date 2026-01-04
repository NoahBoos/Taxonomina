<script lang="ts">
    import {currentTabStore} from "@/renderer/stores/currentTabStore";
    import {ContentTab} from "@/renderer/enums/ContentTab";
</script>

<style>

</style>

<div>
    <p>This is the browser.</p>
    <p>The current tab is { $currentTabStore }</p>
    {#each ContentTab.all as tab}
        {#if tab === $currentTabStore}
            <svelte:component this={ ContentTab.browsers[tab] } />
        {/if}
    {/each}
</div>