<script lang="ts">
    import {currentBrowserTabStore} from "@/renderer/stores/currentBrowserTabStore";
    import {ContentType} from "@/renderer/enums/ContentType";

    let { items = [] }: { items: any } = $props();
</script>

<style>

</style>

<div>
    {#each ContentType.all as tab }
        {#if tab === $currentBrowserTabStore}
            {#each items as item }
                {@const ThumbnailComponent = ContentType.thumbnails[tab]}
                <ThumbnailComponent item={item} />
            {/each}
        {/if}
    {/each}
</div>