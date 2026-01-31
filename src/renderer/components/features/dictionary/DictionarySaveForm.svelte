<script lang="ts">
    import { dictionaryModalStateStore } from "@/renderer/stores/dictionaryModalStateStore";
    import { I_Dictionary } from "@/shared/interfaces/I_Dictionary";
    import { DictionaryService } from "@/renderer/services/DictionaryService";
    import { onMount } from "svelte";
    import TextInput from "@/renderer/components/ui/forms/TextInput.svelte";
    import SubmitButton from "@/renderer/components/ui/forms/SubmitButton.svelte";

    let dictionary: I_Dictionary = { id: 0, name: "", description: "" };

    async function initialize(): Promise<void> {
        if ($dictionaryModalStateStore.state === "list" || $dictionaryModalStateStore.state === "delete") return;
        if ($dictionaryModalStateStore.id !== 0) dictionary = await DictionaryService.readOne($dictionaryModalStateStore.id);
    }

    async function onSubmit(): Promise<void> {
        await DictionaryService.save(dictionary);
    }

    onMount(initialize);
</script>

<style lang="postcss">

</style>

<div>
    {#if dictionary.id === 0}
        <h2>Créer un nouveau dictionnaire</h2>
    {:else}
        <h2>Modifier un dictionnaire : { dictionary.name }</h2>
    {/if}
    <form onsubmit={ onSubmit }>
        <TextInput name="name" label="Nom" placeholder="Mon dictionnaire" bind:value={ dictionary.name } />
        <TextInput name="description" label="Description" placeholder="C'est mon superbe dictionnaire !" bind:value={ dictionary.description } />
        <SubmitButton label={ dictionary.id === 0 ? "Créer" : "Modifier" } />
    </form>
</div>