<script lang="ts">
    import { I_Language } from "@/shared/interfaces/I_Language";
    import { currentInspectorStateStore, setCurrentInspectorState } from "@/renderer/stores/currentInspectorStateStore";
    import { INSPECTOR_STATE_PRESETS } from "@/renderer/utils/inspectorStatePresets";
    import { ContentType } from "@/renderer/enums/ContentType";

    let { item: language }: { item: I_Language } = $props();

    let is_selected: boolean = $derived($currentInspectorStateStore.category === 'content' && $currentInspectorStateStore.type === ContentType.Language && $currentInspectorStateStore.id !== undefined && $currentInspectorStateStore.id === language.id);

    function openUpdateForm() {
        setCurrentInspectorState(INSPECTOR_STATE_PRESETS.CONTENT.LANGUAGE.READ_ONE(language.id));
    }
</script>

<style lang="postcss">
    @reference '../../../styles/styles.css';

    .language-thumbnail {
        @apply text-base-100 text-left flex flex-col items-start p-2 border-2 border-base-40 rounded-md w-full h-fit font-bold bg-base-10 transition-colors duration-250 ease-out;
    }

    .language-thumbnail:hover {
        @apply border-accent-500 bg-accent-400/15;
    }

    .selected {
        @apply border-primary-500 bg-primary-400/15;
    }

    .language-name-native {
        @apply font-bold;
    }

    .language-name-localized {
        @apply text-sm font-bold;
    }
</style>

<button onclick={ openUpdateForm } class="language-thumbnail { is_selected ? 'selected' : ''}">
    <span class="language-name-native">{ language.name_native }</span>
    <span class="language-name-localized">{ language.name_localized }</span>
</button>