<script lang="ts">
    import {currentBrowserTabStore} from "@/renderer/stores/currentBrowserTabStore";
    import {ContentTab} from "@/renderer/enums/ContentTab";

    let { items = [] }: { items: any } = $props();
</script>

<style>

</style>

<div>
    {#each ContentTab.all as tab }
        {#if tab === $currentBrowserTabStore}
            {#each items as item }
                {@const ThumbnailComponent = ContentTab.thumbnails[tab]}
                <ThumbnailComponent item={item} />
            {/each}
        {/if}
    {/each}
</div>