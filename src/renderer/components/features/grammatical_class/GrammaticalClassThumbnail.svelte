<script lang="ts">
    import {I_GrammaticalClass} from "@/shared/interfaces/I_GrammaticalClass";
    import { currentInspectorStateStore, setCurrentInspectorState } from "@/renderer/stores/currentInspectorStateStore";
    import {INSPECTOR_STATE_PRESETS} from "@/renderer/utils/inspectorStatePresets";
    import { ContentType } from "@/renderer/enums/ContentType";

    let { item: grammatical_class }: { item: I_GrammaticalClass } = $props();

    let is_selected: boolean = $derived($currentInspectorStateStore.category === 'content' && $currentInspectorStateStore.type === ContentType.GrammaticalClass && $currentInspectorStateStore.id !== undefined && $currentInspectorStateStore.id === grammatical_class.id);

    function openUpdateForm() {
        setCurrentInspectorState(INSPECTOR_STATE_PRESETS.CONTENT.GRAMMATICAL_CLASS.READ_ONE(grammatical_class.id));
    }
</script>

<style lang="postcss">
    @reference '../../../styles/styles.css';

    .grammatical-class-thumbnail {
        @apply text-base-100 text-left p-2 border-2 border-base-40 rounded-md w-full h-fit font-bold bg-base-10 transition-colors duration-250 ease-out;
    }

    .grammatical-class-thumbnail:hover {
        @apply border-accent-500 bg-accent-400/15;
    }

    .selected {
        @apply border-primary-500 bg-primary-400/15;
    }
</style>

<div>
    <button onclick={ openUpdateForm } class="grammatical-class-thumbnail { is_selected ? 'selected' : '' }">{ grammatical_class.name }</button>
</div>