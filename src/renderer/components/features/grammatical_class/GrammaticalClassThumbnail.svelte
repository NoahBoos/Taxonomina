<script lang="ts">
    import {I_GrammaticalClass} from "@/shared/interfaces/I_GrammaticalClass";
    import {setCurrentInspectorState} from "@/renderer/stores/currentInspectorStateStore";
    import {INSPECTOR_STATE_PRESETS} from "@/renderer/utils/inspectorStatePresets";

    let { item: grammatical_class }: { item: I_GrammaticalClass } = $props();

    function openUpdateForm() {
        setCurrentInspectorState(INSPECTOR_STATE_PRESETS.CONTENT.GRAMMATICAL_CLASS.UPDATE(grammatical_class.id));
    }
</script>

<style lang="postcss">
    @reference '../../../styles/styles.css';

    .grammatical-class-thumbnail {
        @apply text-base-100 text-left text-base p-2 border-2 border-primary-300 rounded-md w-full h-fit font-bold bg-transparent transition-colors duration-250 ease-out;
    }

    .grammatical-class-thumbnail:hover {
        @apply text-base-90 bg-primary-300 border-primary-400;
    }
</style>

<div>
    <button onclick={ openUpdateForm } class="grammatical-class-thumbnail">{ grammatical_class.name }</button>
</div>