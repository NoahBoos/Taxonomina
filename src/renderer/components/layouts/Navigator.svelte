<script lang="ts">
    import {ContentType} from "@/renderer/enums/ContentType";
    import {SpecialContentType} from "@/renderer/enums/SpecialContentType";
    import NavigatorTabButton from "@/renderer/components/navigator/NavigatorTabButton.svelte";
    import {currentBrowserTabStore, resetCurrentBrowserTab, updateCurrentBrowserTab} from "@/renderer/stores/currentBrowserTabStore";
    import {resetCurrentInspectorState, setCurrentInspectorState} from "@/renderer/stores/currentInspectorStateStore";
    import {SPECIAL_CONTENT_INSPECTOR_STATES} from "@/renderer/utils/registries/inspectorRegistry";

    function onContentTabClick(tab: ContentType) {
        if (!ContentType.all.includes($currentBrowserTabStore as ContentType)) resetCurrentInspectorState();
        updateCurrentBrowserTab(tab);
    }

    function onSpecialContentTabClick(tab: SpecialContentType) {
        setCurrentInspectorState(SPECIAL_CONTENT_INSPECTOR_STATES[tab]);
        resetCurrentBrowserTab();
    }
</script>

<style>

</style>

<div>
    <div>
        {#each ContentType.all as tab}
            <NavigatorTabButton tab={ tab } onClick={ () => { onContentTabClick(tab) }} />
        {/each}
    </div>
    <div>
        {#each SpecialContentType.all as tab}
            <NavigatorTabButton tab={tab} onClick={ () => { onSpecialContentTabClick(tab) }} />
        {/each}
    </div>
</div>