<script lang="ts">
    import {currentBrowserTabStore} from "@/renderer/stores/currentBrowserTabStore";
    import {ContentTab} from "@/renderer/enums/ContentTab";
</script>

<style>

</style>

<div>
    <p>This is the browser.</p>
    <p>The current tab is { $currentBrowserTabStore }</p>
    {#each ContentTab.all as tab}
        {#if tab === $currentBrowserTabStore}
            <svelte:component this={ ContentTab.browsers[tab] } />
        {/if}
    {/each}
</div>