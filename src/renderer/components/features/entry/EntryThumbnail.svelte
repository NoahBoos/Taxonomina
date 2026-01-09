<script lang="ts">
    import {I_Entry} from "@/shared/interfaces/I_Entry";
    import {setCurrentInspectorState} from "@/renderer/stores/currentInspectorStateStore";
    import {INSPECTOR_STATE_PRESETS} from "@/renderer/utils/inspectorStatePresets";

    let { item: entry }: { item: I_Entry } = $props();

    function openUpdateForm() {
        setCurrentInspectorState(INSPECTOR_STATE_PRESETS.CONTENT.ENTRY.UPDATE(entry.id));
    }
</script>

<style>

</style>

<div>
    <button onclick={ openUpdateForm }>{ entry.lemma }</button>
</div>