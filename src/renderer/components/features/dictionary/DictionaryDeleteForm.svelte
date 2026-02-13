<script lang="ts">
    import { dictionaryModalStateStore, setToList } from "@/renderer/stores/dictionaryModalStateStore";
    import { DictionaryService } from "@/renderer/services/DictionaryService";
    import { I_Dictionary } from "@/shared/interfaces/I_Dictionary";
    import { onMount } from "svelte";
    import SubmitButton from "@/renderer/components/ui/forms/SubmitButton.svelte";
    import { Undo2 } from "@lucide/svelte";
    import IconButton from "@/renderer/components/ui/interactive/IconButton.svelte";
    import { toggleShowDictionary } from "@/renderer/stores/showDictionaryStore";

    let dictionary: I_Dictionary = { id: 0, name: "", description: "" };

    async function initialize(): Promise<void>  {
        if ($dictionaryModalStateStore.state === "list" || $dictionaryModalStateStore.state === "save") return;
        if ($dictionaryModalStateStore.id !== 0) dictionary = await DictionaryService.readOne($dictionaryModalStateStore.id);
    }

    async function onClick(): Promise<void> {
        if ($dictionaryModalStateStore.state === "list" || $dictionaryModalStateStore.state === "save") return;
        await DictionaryService.delete($dictionaryModalStateStore.id);
        setToList();
    }

    onMount(initialize);
</script>

<style lang="postcss">

</style>

<div class="space-y-4">
    <div class="flex flex-row items-center justify-between">
        <h2>Supprimer { dictionary.name } ?</h2>
        <IconButton icon={ Undo2 } onClick={() => { setToList(); }} />
    </div>
    <div class="space-y-2">
        <p>En supprimant { dictionary.name }, ce dictionnaire et l'entièreté des données suivantes seront supprimées :</p>
        <ul class="list-disc pl-6">
            <li>Ses langues.</li>
            <li>Ses classes grammaticales.</li>
            <li>Ses genres grammaticaux.</li>
            <li>Ses entrées.</li>
        </ul>
        <p>En cliquant sur ce bouton, vous acceptez de perdre ce dictionnaire pour l'éternité (et l'éternité, c'est super long...)</p>
    </div>
    <button type="button" onclick={ onClick } class="block font-semibold px-4 py-2 mx-auto border-2 rounded-md border-primary-500 bg-transparent w-fit transition-colors duration-250 ease-out hover:bg-accent-400/15 hover:border-accent-500">Supprimer</button>
</div>