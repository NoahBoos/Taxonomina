<script lang="ts">
    import {currentBrowserTabStore} from "@/renderer/stores/currentBrowserTabStore";
    import {ContentType} from "@/renderer/enums/ContentType";
    import {BROWSER_REGISTRY} from "@/renderer/utils/registries/browserRegistry";
</script>

<style>

</style>

{#if $currentBrowserTabStore != null}
    <div id="browser" class="p-4 w-[20%] bg-base-25">
        {#each ContentType.all as tab}
            {#if tab === $currentBrowserTabStore}
                {@const BrowserComponent = BROWSER_REGISTRY[tab]}
                <BrowserComponent />
            {/if}
        {/each}
    </div>
{/if}