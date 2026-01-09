<script lang="ts">
    import {I_Language} from "@/shared/interfaces/I_Language";
    import {setCurrentInspectorState} from "@/renderer/stores/currentInspectorStateStore";
    import {INSPECTOR_STATE_PRESETS} from "@/renderer/utils/inspectorStatePresets";

    let { item: language }: { item: I_Language } = $props();

    function openUpdateForm() {
        setCurrentInspectorState(INSPECTOR_STATE_PRESETS.CONTENT.LANGUAGE.UPDATE(language.id));
    }
</script>

<style>

</style>

<div>
    <button onclick={ openUpdateForm }>
        <span>{ language.name_native }</span>
        <span>{ language.name_local }</span>
    </button>
</div>