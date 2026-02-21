<script lang="ts">
    import {I_Definition} from "@/shared/interfaces/I_Definition";
    import IconButton from "@/renderer/components/ui/interactive/IconButton.svelte";
    import {Minus, Plus, TextQuote} from "@lucide/svelte";
    import ActionableTextInput from "@/renderer/components/ui/forms/ActionableTextInput.svelte";

    interface Props {
        selected_definitions: I_Definition[];
    }

    let { selected_definitions = $bindable([]) }: Props = $props();

    function addDefinition() {
        let definition: I_Definition = { id: 0, definition: "", clientKey: `definition:${crypto.randomUUID()}` };
        selected_definitions.push(definition);
    }

    function removeDefinition(definition: I_Definition) {
        selected_definitions = selected_definitions.filter(d => d !== definition);
    }
</script>

<style>

</style>

<div class="space-y-2">
    <div class="flex flex-row justify-between items-center">
        <div class="flex flex-row items-center gap-2">
            <TextQuote />
            <h3>Définition</h3>
        </div>
        <IconButton icon={ Plus } onClick={ () => addDefinition() } />
    </div>
    {#if selected_definitions.length === 0}
        <p>Aucune définition n'existe pour cette entrée.</p>
        <p>Cliquez sur le bouton "Plus" en-haut à droite de la section pour ajouter une première définition.</p>
    {:else}
        {#each selected_definitions as definition}
            <ActionableTextInput name={ definition.clientKey } label={'Définition ' + (selected_definitions.indexOf(definition) + 1) } placeholder="Entrez votre définition." bind:value={ definition.definition } icon={ Minus } onClick={ () => removeDefinition(definition) } />
        {/each}
    {/if}
</div>