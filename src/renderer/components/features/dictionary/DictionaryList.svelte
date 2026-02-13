<script lang="ts">
    import { dictionariesStore, refreshDictionaries } from "@/renderer/stores/dictionariesStore";
    import { I_Dictionary } from "@/shared/interfaces/I_Dictionary";
    import Searchbar from "@/renderer/components/ui/forms/Searchbar.svelte";
    import { Plus, X } from "@lucide/svelte";
    import { onMount } from "svelte";
    import DictionaryDetail from "@/renderer/components/features/dictionary/DictionaryDetail.svelte";
    import { setToSave } from "@/renderer/stores/dictionaryModalStateStore";
    import IconButton from "@/renderer/components/ui/interactive/IconButton.svelte";
    import { toggleShowDictionary } from "@/renderer/stores/showDictionaryStore";

    let query: string = $state('');
    let filteredDictionaries: I_Dictionary[] = $derived($dictionariesStore.filter(dictionary =>
        dictionary.name.toLowerCase().includes(query.toLowerCase()) ||
        dictionary.description?.toLowerCase().includes(query.toLowerCase())
    ).sort((a, b) => a.name.localeCompare(b.name)));

    onMount(() => { refreshDictionaries(); });
</script>

<style lang="postcss">
    @reference '../../../styles/styles.css';

    .add-dictionary-button {
        @apply flex flex-row gap-2 text-base-100 px-2 py-1 border-2 rounded-md border-primary-500 bg-transparent w-fit transition-colors duration-250 ease-out;
    }

    .add-dictionary-button:hover {
        @apply bg-accent-400/15 border-accent-500;
    }
</style>

<div>
    <div class="flex flex-row items-center justify-between mb-4">
        <h2>Liste des dictionnaires</h2>
        <IconButton icon={ X } onClick={() => { toggleShowDictionary(false); }} />
    </div>
    <div class="space-y-4">
        <div class="flex flex-row justify-between">
            <Searchbar bind:query placeholder="Rechercher un dictionnaire..." variant="fit" />
            <button onclick={ () => { setToSave(); } } class="add-dictionary-button">
                <Plus /> Créer un dictionnaire
            </button>
        </div>
        <div class="space-y-2 overflow-y-auto overflow-x-hidden h-78">
            {#if filteredDictionaries.length === 0}
                <p class="text-center">Aucun dictionnaire trouvé{ query ? ' pour la recherche "' + query + '"' : '' }.</p>
            {:else}
                {#each filteredDictionaries as dictionary}
                    <DictionaryDetail dictionary={ dictionary } />
                {/each}
            {/if}
        </div>
    </div>
</div>