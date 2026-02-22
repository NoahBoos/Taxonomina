<script lang="ts">
    import {I_Entry} from "@/shared/interfaces/I_Entry";
    import { currentInspectorStateStore, setCurrentInspectorState } from "@/renderer/stores/currentInspectorStateStore";
    import {INSPECTOR_STATE_PRESETS} from "@/renderer/utils/inspectorStatePresets";
    import { ContentType } from "@/renderer/enums/ContentType";
    import { I_Language } from "@/shared/interfaces/I_Language";
    import { LanguageService } from "@/renderer/services/LanguageService";

    interface Props {
        item: I_Entry;
        variant?: 'browser' | 'inspector';
    }

    let { item: entry, variant = 'browser' }: Props = $props();

    let language: I_Language | undefined = $state(undefined);

    let is_selected: boolean = $derived($currentInspectorStateStore.category === 'content' && $currentInspectorStateStore.type === ContentType.Entry && $currentInspectorStateStore.id !== undefined && $currentInspectorStateStore.id === entry.id);

    function openUpdateForm() {
        setCurrentInspectorState(INSPECTOR_STATE_PRESETS.CONTENT.ENTRY.READ_ONE(entry.id));
    }

    async function loadLanguage() {
        language = await LanguageService.readOne(entry.language_id)
    }

    $effect(() => {
       loadLanguage();
    });
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

<button onclick={ openUpdateForm } class="entry-thumbnail { is_selected ? 'selected' : '' } { variant === 'browser' ? '' : 'flex flex-col items-start' }">
    {#if variant === 'inspector' && language}
        <span class="text-sm">{ language.name_native }</span>
    {/if}
    <span>{ entry.lemma }</span>
</button>