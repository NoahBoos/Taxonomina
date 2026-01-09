<script lang="ts">
    import {I_GrammaticalGenre} from "@/shared/interfaces/I_GrammaticalGenre";
    import {setCurrentInspectorState} from "@/renderer/stores/currentInspectorStateStore";
    import {INSPECTOR_STATE_PRESETS} from "@/renderer/utils/inspectorStatePresets";

    let { item: grammatical_genre }: { item: I_GrammaticalGenre } = $props();

    function openUpdateForm() {
        setCurrentInspectorState(INSPECTOR_STATE_PRESETS.CONTENT.GRAMMATICAL_GENRE.UPDATE(grammatical_genre.id));
    }
</script>

<style>

</style>

<div>
    <button onclick={ openUpdateForm }>{ grammatical_genre.name }</button>
</div>