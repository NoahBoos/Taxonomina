<script lang="ts">
    import {currentBrowserTabStore} from "@/renderer/stores/currentBrowserTabStore";
    import {ContentType} from "@/renderer/enums/ContentType";
    import {THUMBNAIL_REGISTRY} from "@/renderer/utils/registries/thumbnailRegistry";

    let { items = [] }: { items: any } = $props();
</script>

<style>

</style>

<div class="flex-1 space-y-2 px-4 w-full overflow-y-auto overflow-x-visible">
    {#each ContentType.all as tab }
        {#if tab === $currentBrowserTabStore}
            {#each items as item }
                {@const ThumbnailComponent = THUMBNAIL_REGISTRY[tab]}
                <ThumbnailComponent item={item} />
            {/each}
        {/if}
    {/each}
</div>