<script lang="ts">
    import {ContentType} from "@/renderer/enums/ContentType";
    import {SpecialContentType} from "@/renderer/enums/SpecialContentType";
    import NavigatorTabButton from "@/renderer/components/navigator/NavigatorTabButton.svelte";
    import {settings} from "@/renderer/stores/settingsStore";
    import {currentBrowserTabStore, resetCurrentBrowserTab, updateCurrentBrowserTab} from "@/renderer/stores/currentBrowserTabStore";
    import {resetCurrentInspectorState, setCurrentInspectorState} from "@/renderer/stores/currentInspectorStateStore";
    import {SPECIAL_CONTENT_INSPECTOR_STATES} from "@/renderer/utils/registries/inspectorRegistry";
    import DictionaryInformationButton
        from "@/renderer/components/features/dictionary/DictionaryInformationButton.svelte";

    let help_button_visibility: boolean = $state($settings!.helpButtonVisibility);

    function onContentTabClick(tab: ContentType) {
        if (!ContentType.all.includes($currentBrowserTabStore as ContentType)) resetCurrentInspectorState();
        updateCurrentBrowserTab(tab);
    }

    function onSpecialContentTabClick(tab: SpecialContentType) {
        setCurrentInspectorState(SPECIAL_CONTENT_INSPECTOR_STATES[tab]);
        resetCurrentBrowserTab();
    }

    $effect(() => { help_button_visibility = $settings!.helpButtonVisibility });
</script>

<style>

</style>

<div class="flex flex-col w-[17.5%] p-4 gap-4 bg-base-20">
    <DictionaryInformationButton />
    <div class="space-y-2">
        {#each ContentType.all as tab}
            <NavigatorTabButton tab={ tab } onClick={ () => { onContentTabClick(tab) }} />
        {/each}
    </div>
    <div class="mt-auto space-y-2">
        {#each SpecialContentType.all as tab}
            {#if tab !== SpecialContentType.Help || help_button_visibility}
                <NavigatorTabButton tab={tab} onClick={ () => { onSpecialContentTabClick(tab) }} />
            {/if}
        {/each}
    </div>
</div>