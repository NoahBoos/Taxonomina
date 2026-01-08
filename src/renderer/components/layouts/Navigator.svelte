<script lang="ts">
    import {ContentType} from "@/renderer/enums/ContentType";
    import {SpecialContentType} from "@/renderer/enums/SpecialContentType";
    import NavigatorTabButton from "@/renderer/components/navigator/NavigatorTabButton.svelte";
</script>

<style>

</style>

<div>
    <div>
        {#each ContentType.all as tab}
            <NavigatorTabButton tab={tab} />
        {/each}
    </div>
    <div>
        {#each SpecialContentType.all as tab}
            <NavigatorTabButton tab={tab} />
        {/each}
    </div>
</div>