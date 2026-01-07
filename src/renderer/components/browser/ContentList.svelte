<script lang="ts">
    import {ContentType} from "@/renderer/enums/ContentType";
    import {getContext} from "svelte";
    import LanguageThumbnail from "@/renderer/components/features/language/LanguageThumbnail.svelte";
    import GrammaticalClassThumbnail from "@/renderer/components/features/grammatical_class/GrammaticalClassThumbnail.svelte";
    import GrammaticalGenreThumbnail from "@/renderer/components/features/grammatical_genre/GrammaticalGenreThumbnail.svelte";
    import EntryThumbnail from "@/renderer/components/features/entry/EntryThumbnail.svelte";
    import {CONTENT_TYPE_KEY} from "@/renderer/utils/symbols";

    let { items = [] }: { items: any } = $props();

    let contentType: ContentType = getContext<ContentType>(CONTENT_TYPE_KEY);
</script>

<style>

</style>

<div>
    {#if contentType === ContentType.Language}
        {#each items as item }
            <LanguageThumbnail item={item} />
        {/each}
    {:else if contentType === ContentType.GrammaticalClass}
        {#each items as item }
            <GrammaticalClassThumbnail item={item} />
        {/each}
    {:else if contentType === ContentType.GrammaticalGenre}
        {#each items as item }
            <GrammaticalGenreThumbnail item={item} />
        {/each}
    {:else if contentType === ContentType.Entry}
        {#each items as item }
            <EntryThumbnail item={item} />
        {/each}
    {/if}
</div>