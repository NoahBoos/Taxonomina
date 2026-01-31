<script lang="ts">
    import { dictionaryModalStateStore, setToList } from "@/renderer/stores/dictionaryModalStateStore";
    import { DictionaryService } from "@/renderer/services/DictionaryService";
    import { I_Dictionary } from "@/shared/interfaces/I_Dictionary";
    import { onMount } from "svelte";
    import SubmitButton from "@/renderer/components/ui/forms/SubmitButton.svelte";
    import { Undo2, X } from "@lucide/svelte";
    import { toggleShowDictionary } from "@/renderer/stores/showDictionaryStore";
    import IconButton from "@/renderer/components/ui/interactive/IconButton.svelte";

    let dictionary: I_Dictionary = { id: 0, name: "", description: "" };

    async function initialize(): Promise<void>  {
        if ($dictionaryModalStateStore.state === "list" || $dictionaryModalStateStore.state === "save") return;
        if ($dictionaryModalStateStore.id !== 0) dictionary = await DictionaryService.readOne($dictionaryModalStateStore.id);
    }

    async function onSubmit(): Promise<void> {
        if ($dictionaryModalStateStore.state === "list" || $dictionaryModalStateStore.state === "save") return;
        await DictionaryService.delete($dictionaryModalStateStore.id);
    }

    onMount(initialize);
</script>

<style lang="postcss">

</style>

<div>
    <div class="flex flex-row items-center justify-between mb-4">
        <h2>Supprimer { dictionary.name } ?</h2>
        <IconButton icon={ Undo2 } onClick={() => { setToList(); }} />
    </div>
    <p>En supprimant { dictionary.name }, ce dictionnaire et l'entièreté des données suivantes seront supprimées :</p>
    <ul>
        <li>Ses langues.</li>
        <li>Ses classes grammaticales.</li>
        <li>Ses genres grammaticaux.</li>
        <li>Ses entrées.</li>
    </ul>
    <p>En cliquant sur ce bouton, vous acceptez de perdre ce dictionnaire pour l'éternité (et l'éternité, c'est super long...)</p>
    <form onsubmit={ onSubmit }>
        <SubmitButton label="Supprimer" />
    </form>
</div>