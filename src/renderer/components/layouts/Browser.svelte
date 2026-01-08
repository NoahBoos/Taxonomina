<script lang="ts">
    import {currentBrowserTabStore} from "@/renderer/stores/currentBrowserTabStore";
    import {ContentType} from "@/renderer/enums/ContentType";
    import {BROWSER_REGISTRY} from "@/renderer/utils/registries/browserRegistry";
</script>

<style>

</style>

<div>
    <p>This is the browser.</p>
    <p>The current tab is { $currentBrowserTabStore }</p>
    {#each ContentType.all as tab}
        {#if tab === $currentBrowserTabStore}
            {@const BrowserComponent = BROWSER_REGISTRY[tab]}
            <BrowserComponent />
        {/if}
    {/each}
</div>