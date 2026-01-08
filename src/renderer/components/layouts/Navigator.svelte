<script lang="ts">
    import {ContentType} from "@/renderer/enums/ContentType";
    import {SpecialContentTab} from "@/renderer/enums/SpecialContentTab";
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
        {#each SpecialContentTab.all as tab}
            <NavigatorTabButton tab={tab} />
        {/each}
    </div>
</div>