<script lang="ts">
    import {currentBrowserTabStore} from "@/renderer/stores/currentBrowserTabStore";
    import {ContentType} from "@/renderer/enums/ContentType";
</script>

<style>

</style>

<div>
    <p>This is the browser.</p>
    <p>The current tab is { $currentBrowserTabStore }</p>
    {#each ContentType.all as tab}
        {#if tab === $currentBrowserTabStore}
            {@const BrowserComponent = ContentType.browsers[tab]}
            <BrowserComponent />
        {/if}
    {/each}
</div>