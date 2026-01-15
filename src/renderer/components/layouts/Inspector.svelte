<script lang="ts">
    import {currentInspectorStateStore} from "@/renderer/stores/currentInspectorStateStore";
    import {INSPECTOR_REGISTRY} from "@/renderer/utils/registries/inspectorRegistry";

    let InspectorComponent = $derived.by(() => {
        const state = $currentInspectorStateStore;

        if (state.category === 'content') {
            return INSPECTOR_REGISTRY.content[state.type]?.[state.action];
        } else if (state.category === 'special-content') {
            return INSPECTOR_REGISTRY['special-content'][state.type];
        } else {
            return INSPECTOR_REGISTRY['idle'];
        }
    });
</script>

<style>

</style>

<div class="flex-1 bg-base-30">
    <InspectorComponent />
</div>