<script lang="ts">
    import {I_Language} from "@/shared/interfaces/I_Language";
    import {setCurrentInspectorState} from "@/renderer/stores/currentInspectorStateStore";
    import {INSPECTOR_STATE_PRESETS} from "@/renderer/utils/inspectorStatePresets";

    let { item: language }: { item: I_Language } = $props();

    function openUpdateForm() {
        setCurrentInspectorState(INSPECTOR_STATE_PRESETS.CONTENT.LANGUAGE.UPDATE(language.id));
    }
</script>

<style lang="postcss">
    @reference '../../../styles/styles.css';

    .language-thumbnail {
        @apply text-base-100 text-left text-base p-2 border-2 border-primary-300 rounded-md w-full h-fit font-bold bg-transparent transition-colors duration-250 ease-out;
    }

    .language-thumbnail:hover {
        @apply text-base-90 bg-primary-300 border-primary-400;
    }

    .language-name-native {
        @apply font-bold;
    }

    .language-name-local {
        @apply text-sm font-bold;
    }
</style>

<button onclick={ openUpdateForm } class="language-thumbnail">
    <span class="language-name-native">{ language.name_native }</span>
    <span class="language-name-local">{ language.name_local }</span>
</button>