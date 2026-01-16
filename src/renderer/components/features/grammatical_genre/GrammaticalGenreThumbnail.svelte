<script lang="ts">
    import {I_GrammaticalGenre} from "@/shared/interfaces/I_GrammaticalGenre";
    import {setCurrentInspectorState} from "@/renderer/stores/currentInspectorStateStore";
    import {INSPECTOR_STATE_PRESETS} from "@/renderer/utils/inspectorStatePresets";

    let { item: grammatical_genre }: { item: I_GrammaticalGenre } = $props();

    function openUpdateForm() {
        setCurrentInspectorState(INSPECTOR_STATE_PRESETS.CONTENT.GRAMMATICAL_GENRE.UPDATE(grammatical_genre.id));
    }
</script>

<style lang="postcss">
    @reference '../../../styles/styles.css';

    .grammatical-genre-thumbnail {
        @apply text-base-100 text-left p-2 border-2 border-primary-300 rounded-md w-full h-fit font-bold bg-transparent transition-colors duration-250 ease-out;
    }

    .grammatical-genre-thumbnail:hover {
        @apply text-base-90 bg-primary-300 border-primary-400;
    }
</style>

<div>
    <button onclick={ openUpdateForm } class="grammatical-genre-thumbnail">{ grammatical_genre.name }</button>
</div>