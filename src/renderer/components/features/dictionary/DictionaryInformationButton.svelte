<script lang="ts">
    import {onMount} from "svelte";
    import {currentDictionary, refreshCurrentDictionary} from "@/renderer/stores/currentDictionaryStore";
    import { toggleShowDictionary } from "@/renderer/stores/showDictionaryStore";

    onMount(() => { refreshCurrentDictionary() });

    function openDictionaryModal(): void {
        toggleShowDictionary(true);
    }
</script>

<style lang="postcss">
    @reference '../../../styles/styles.css';

    #dictionary-information-button {
        @apply flex flex-col items-start gap-2 p-2 border-2 border-base-40 rounded-md bg-base-10 transition-colors duration-250 ease-out;
    }

    #dictionary-information-button:hover {
        @apply text-base-90 bg-base-30 border-primary-400;

        > .current-dictionary-name {
            @apply border-primary-400;
        }
    }

    .current-dictionary-name {
        @apply text-left pb-2 mb-2 border-b-2 border-base-40 w-full transition-colors duration-250 ease-out;
    }

    .current-dictionary-description {
        @apply text-sm text-left w-full;
    }
</style>

<button type="button" id="dictionary-information-button" onclick={ openDictionaryModal }>
    <span class="current-dictionary-name">{ $currentDictionary?.name }</span>
    <span class="current-dictionary-description">{ $currentDictionary?.description }</span>
</button>