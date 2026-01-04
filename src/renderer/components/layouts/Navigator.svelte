<script lang="ts">
    import {ContentTab} from "@/renderer/enums/ContentTab";
    import {SpecialContentTab} from "@/renderer/enums/SpecialContentTab";
    import TabButton from "@/renderer/components/navigator/TabButton.svelte";
</script>

<style>

</style>

<div>
    <div>
        {#each ContentTab.all as tab}
            <TabButton tab={tab} />
        {/each}
    </div>
    <div>
        {#each SpecialContentTab.all as tab}
            <TabButton tab={tab} />
        {/each}
    </div>
</div>