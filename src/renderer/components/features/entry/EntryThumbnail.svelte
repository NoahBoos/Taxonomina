<script lang="ts">
    import {I_Entry} from "@/shared/interfaces/I_Entry";
    import {setCurrentInspectorState} from "@/renderer/stores/currentInspectorStateStore";
    import {INSPECTOR_STATE_PRESETS} from "@/renderer/utils/inspectorStatePresets";

    let { item: entry }: { item: I_Entry } = $props();

    function openUpdateForm() {
        setCurrentInspectorState(INSPECTOR_STATE_PRESETS.CONTENT.ENTRY.UPDATE(entry.id));
    }
</script>

<style lang="postcss">
    @reference '../../../styles/styles.css';

    .entry-thumbnail {
        @apply text-base-100 text-left text-base p-2 border-2 border-primary-300 rounded-md w-full h-fit font-bold bg-transparent transition-colors duration-250 ease-out;
    }

    .entry-thumbnail:hover {
        @apply text-base-90 bg-primary-300 border-primary-400;
    }
</style>

<button onclick={ openUpdateForm } class="entry-thumbnail">{ entry.lemma }</button>