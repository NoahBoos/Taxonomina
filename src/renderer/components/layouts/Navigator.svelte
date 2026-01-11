<script lang="ts">
    import {ContentType} from "@/renderer/enums/ContentType";
    import {SpecialContentType} from "@/renderer/enums/SpecialContentType";
    import NavigatorTabButton from "@/renderer/components/navigator/NavigatorTabButton.svelte";
    import {updateCurrentBrowserTab} from "@/renderer/stores/currentBrowserTabStore";
    import {setCurrentInspectorState} from "@/renderer/stores/currentInspectorStateStore";
    import {SPECIAL_CONTENT_INSPECTOR_STATES} from "@/renderer/utils/registries/inspectorRegistry";
</script>

<style>

</style>

<div>
    <div>
        {#each ContentType.all as tab}
            <NavigatorTabButton tab={ tab } onClick={ () => { updateCurrentBrowserTab(tab) }} />
        {/each}
    </div>
    <div>
        {#each SpecialContentType.all as tab}
            <NavigatorTabButton tab={tab} onClick={ () => { setCurrentInspectorState(SPECIAL_CONTENT_INSPECTOR_STATES[tab]) }} />
        {/each}
    </div>
</div>