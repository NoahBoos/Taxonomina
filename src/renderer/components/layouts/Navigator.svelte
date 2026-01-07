<script lang="ts">
    import {ContentTab} from "@/renderer/enums/ContentTab";
    import {SpecialContentTab} from "@/renderer/enums/SpecialContentTab";
    import NavigatorTabButton from "@/renderer/components/navigator/NavigatorTabButton.svelte";
</script>

<style>

</style>

<div>
    <div>
        {#each ContentTab.all as tab}
            <NavigatorTabButton tab={tab} />
        {/each}
    </div>
    <div>
        {#each SpecialContentTab.all as tab}
            <NavigatorTabButton tab={tab} />
        {/each}
    </div>
</div>