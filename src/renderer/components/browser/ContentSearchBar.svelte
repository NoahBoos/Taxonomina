<script lang="ts">
    import {ContentType} from "@/renderer/enums/ContentType";
    import {getContext} from "svelte";
    import {CONTENT_TYPE_KEY} from "@/renderer/utils/symbols";

    let { query = $bindable('') }: { query: string } = $props();

    let contentType: ContentType = getContext<ContentType>(CONTENT_TYPE_KEY);
</script>

<style>

</style>

<div>
    {#each ContentType.all as type}
        {#if type === contentType}
            <input type="text" placeholder="{ ContentType.searchBarLabels[type] }" bind:value={ query } />
        {/if}
    {/each}
</div>