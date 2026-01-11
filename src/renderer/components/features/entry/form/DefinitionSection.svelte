<script lang="ts">
    import {I_Definition} from "@/shared/interfaces/I_Definition";
    import IconButton from "@/renderer/components/ui/interactive/IconButton.svelte";
    import {Minus, Plus} from "@lucide/svelte";

    interface Props {
        selected_definitions: I_Definition[];
    }

    let { selected_definitions = $bindable([]) }: Props = $props();

    function addDefinition() {
        let definition: I_Definition = { id: 0, definition: "" };
        selected_definitions.push(definition);
    }

    function removeDefinition(definition: I_Definition) {
        selected_definitions = selected_definitions.filter(d => d !== definition);
    }
</script>

<style>

</style>

<div>
    <IconButton icon={ Plus } onClick={ () => addDefinition() } />
    {#each selected_definitions as definition}
        <div>
            <input type="text" bind:value={ definition.definition } />
            <IconButton icon={ Minus } onClick={ () => removeDefinition(definition) } />
        </div>
    {/each}
</div>