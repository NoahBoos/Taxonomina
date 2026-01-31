<script lang="ts">
    import { dictionariesStore, refreshDictionaries } from "@/renderer/stores/dictionariesStore";
    import { I_Dictionary } from "@/shared/interfaces/I_Dictionary";
    import Searchbar from "@/renderer/components/ui/forms/Searchbar.svelte";
    import { Plus } from "@lucide/svelte";
    import { onMount } from "svelte";
    import DictionaryDetail from "@/renderer/components/features/dictionary/DictionaryDetail.svelte";

    let query: string = $state('');
    let filteredDictionaries: I_Dictionary[] = $derived($dictionariesStore.filter(dictionary =>
        dictionary.name.toLowerCase().includes(query.toLowerCase()) ||
        dictionary.description?.toLowerCase().includes(query.toLowerCase())
    ));

    onMount(() => { refreshDictionaries(); });

    $effect(() => { console.log(filteredDictionaries) });
</script>

<style lang="postcss">
    @reference '../../../styles/styles.css';

    .add-dictionary-button {
        @apply flex flex-row gap-2 text-base-100 px-2 py-1 border-2 rounded-md border-primary-300 w-fit transition-colors duration-250 ease-out;
    }

    .add-dictionary-button:hover {
        @apply text-base-90 border-primary-400 bg-primary-500;
    }
</style>

<div>
    <h2>
        Liste des dictionnaires
    </h2>
    <div class="space-y-4">
        <div class="flex flex-row justify-between">
            <Searchbar bind:query placeholder="Rechercher un dictionnaire..." variant="fit" />
            <button onclick={ () => { console.log("Ajout d'un dictionnaire."); } } class="add-dictionary-button">
                <Plus /> Créer un dictionnaire
            </button>
        </div>
        <div class="space-y-2">
            {#if filteredDictionaries.length === 0}
                <p>Aucun dictionnaire trouvé{ query ? ' pour la recherche "' + query + '"' : '' }.</p>
            {:else}
                {#each filteredDictionaries as dictionary}
                    <DictionaryDetail dictionary={ dictionary } />
                {/each}
            {/if}
        </div>
    </div>
</div>