<script lang="ts">
    import {ContentTab} from "@/renderer/enums/ContentTab";
    import {SpecialContentTab} from "@/renderer/enums/SpecialContentTab";
    import {updateCurrentTab} from "@/renderer/stores/currentTabStore";
</script>

<style>

</style>

<div>
    <div>
        {#each ContentTab.all as tab}
            <button on:click={() => updateCurrentTab(tab)}>
                { ContentTab.labels[tab] }
            </button>
        {/each}
    </div>
    <div>
        {#each SpecialContentTab.all as tab}
            <button on:click={() => updateCurrentTab(tab)}>
                { SpecialContentTab.labels[tab] }
            </button>
        {/each}
    </div>
</div>