<script lang="ts">
    import {I_Definition} from "@/shared/interfaces/I_Definition";
    import IconButton from "@/renderer/components/ui/interactive/IconButton.svelte";
    import {Minus, Plus, TextQuote} from "@lucide/svelte";
    import ActionableTextInput from "@/renderer/components/ui/forms/ActionableTextInput.svelte";
    import { definitionFormErrorsStore } from "@/renderer/stores/definitionFormErrorsStore";

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
    <button type="button" class="flex flex-row items-center gap-2 p-2 border-2 border-base-40 rounded-md bg-base-10 w-full transition-colors duration-250 ease-out hover:bg-accent-400/15 hover:border-accent-500" onclick={ () => addDefinition() }>
        <Plus /> <span>Ajouter une nouvelle définition</span>
    </button>
    {#if selected_definitions.length === 0}
        <p>Aucune définition n'existe pour cette entrée.</p>
        <p>Cliquez sur le bouton "Plus" en-haut à droite de la section pour ajouter une première définition.</p>
    {:else}
        {#each selected_definitions as definition}
            <ActionableTextInput name={ definition.clientKey } label={'Définition ' + (selected_definitions.indexOf(definition) + 1) } placeholder="Entrez votre définition." bind:value={ definition.definition } icon={ Minus } onClick={ () => removeDefinition(definition) } errors={ $definitionFormErrorsStore.filter(e => e.target.type === 'form_field' && e.target.field_name === definition.clientKey) } />
        {/each}
    {/if}
</div>