<script lang="ts">
    import {I_Entry} from "@/shared/interfaces/I_Entry";
    import { currentInspectorStateStore, setCurrentInspectorState } from "@/renderer/stores/currentInspectorStateStore";
    import {INSPECTOR_STATE_PRESETS} from "@/renderer/utils/inspectorStatePresets";
    import { ContentType } from "@/renderer/enums/ContentType";

    let { item: entry }: { item: I_Entry } = $props();

    let is_selected: boolean = $derived($currentInspectorStateStore.category === 'content' && $currentInspectorStateStore.type === ContentType.Entry && $currentInspectorStateStore.id !== undefined && $currentInspectorStateStore.id === entry.id);

    function openUpdateForm() {
        setCurrentInspectorState(INSPECTOR_STATE_PRESETS.CONTENT.ENTRY.UPDATE(entry.id));
    }
</script>

<style lang="postcss">
    @reference '../../../styles/styles.css';

    .entry-thumbnail {
        @apply text-base-100 text-left p-2 border-2 border-base-40 rounded-md w-full h-fit font-bold bg-base-10 transition-colors duration-250 ease-out;
    }

    .entry-thumbnail:hover {
        @apply border-accent-500 bg-accent-400/15;
    }

    .selected {
        @apply border-primary-500 bg-primary-400/15;
    }
</style>

<button onclick={ openUpdateForm } class="entry-thumbnail { is_selected ? 'selected' : '' }">{ entry.lemma }</button>