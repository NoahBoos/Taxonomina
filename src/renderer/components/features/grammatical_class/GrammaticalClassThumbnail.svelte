<script lang="ts">
    import {I_GrammaticalClass} from "@/shared/interfaces/I_GrammaticalClass";
    import {setCurrentInspectorState} from "@/renderer/stores/currentInspectorStateStore";
    import {INSPECTOR_STATE_PRESETS} from "@/renderer/utils/inspectorStatePresets";

    let { item: grammatical_class }: { item: I_GrammaticalClass } = $props();

    function openUpdateForm() {
        setCurrentInspectorState(INSPECTOR_STATE_PRESETS.CONTENT.GRAMMATICAL_CLASS.UPDATE(grammatical_class.id));
    }
</script>

<style>

</style>

<div>
    <button onclick={ openUpdateForm }>{ grammatical_class.name }</button>
</div>