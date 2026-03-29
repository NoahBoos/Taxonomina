<script lang="ts">
    import {I_Definition} from "@/shared/interfaces/I_Definition";
    import {Plus} from "@lucide/svelte";
    import DefinitionInput from "@/renderer/components/features/definition/DefinitionInput.svelte";

    interface Props {
        selected_definitions: I_Definition[];
    }

    let { selected_definitions = $bindable([]) }: Props = $props();

    function addDefinition() {
        let definition: I_Definition = { id: 0, definition: "", categories: [], clientKey: `definition:${crypto.randomUUID()}` };
        selected_definitions.push(definition);
    }

    function removeDefinition(definition: I_Definition) {
        selected_definitions = selected_definitions.filter(d => d !== definition);
    }
</script>

<style>

</style>

<div class="space-y-4">
    <button type="button" class="flex flex-row items-center gap-2 p-2 border-2 border-dashed border-base-40 rounded-md bg-base-10 w-full transition-colors duration-250 ease-out hover:bg-accent-400/15 hover:border-accent-500" onclick={ () => addDefinition() }>
        <Plus /> <span>Ajouter une nouvelle définition</span>
    </button>
    <div class="space-y-2">
        {#if selected_definitions.length === 0}
            <p>Aucune définition n'existe pour cette entrée.</p>
            <p>Cliquez sur le bouton "Plus" en-haut à droite de la section pour ajouter une première définition.</p>
        {:else}
            {#each selected_definitions as definition}
                <DefinitionInput label={ 'Définition ' + (selected_definitions.indexOf(definition) + 1) } { definition } onRemove={ () => removeDefinition(definition) } />
            {/each}
        {/if}
    </div>
</div>