<script lang="ts">
    import {ContentTab} from "@/renderer/enums/ContentTab";
    import {SpecialContentTab} from "@/renderer/enums/SpecialContentTab";
</script>

<style>

</style>

<div>
    <div>
        {#each ContentTab.all as tab}
            <button>
                { ContentTab.labels[tab] }
            </button>
        {/each}
    </div>
    <div>
        {#each SpecialContentTab.all as tab}
            <button>
                { SpecialContentTab.labels[tab] }
            </button>
        {/each}
    </div>
</div>