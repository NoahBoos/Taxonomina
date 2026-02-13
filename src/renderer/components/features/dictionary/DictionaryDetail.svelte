<script lang="ts">
    import { I_Dictionary } from "@/shared/interfaces/I_Dictionary";
    import { currentDictionary, setCurrentDictionary } from "@/renderer/stores/currentDictionaryStore";
    import { Settings2, Trash2 } from "@lucide/svelte";
    import { setToDelete, setToSave } from "@/renderer/stores/dictionaryModalStateStore";

    interface Props {
        dictionary: I_Dictionary;
    }

    let { dictionary }: Props = $props();
</script>

<style>

</style>

<div class="flex flex-row p-2 justify-between border-2 rounded-lg { dictionary.id === $currentDictionary?.id ? 'border-primary-500 bg-primary-400/25' : 'border-base-50 bg-base-40/25' }">
    <div class="flex flex-col">
        <div class="flex flex-row gap-2">
            <p class="text-lg">{ dictionary.name }</p>
            {#if dictionary.id === $currentDictionary?.id}
                <p class="px-2 border-2 border-base-40 rounded-lg bg-base-10">Actif</p>
            {/if}
        </div>
        <p>{ dictionary.description }</p>
    </div>
    <div class="flex flex-row gap-2 items-center">
        {#if dictionary.id !== $currentDictionary?.id}
            <button onclick={ () => { setCurrentDictionary(dictionary.id) } } class="text-base-100 px-4 py-2 border-2 rounded-md border-base-40 hover:border-accent-500 bg-base-10 hover:bg-accent-400/15 w-fit transition-colors duration-250 ease-out">
                Activer
            </button>
        {/if}
        <button onclick={ () => { setToSave(dictionary.id); } } class="text-base-100 p-2 border-2 rounded-md border-base-40 hover:border-accent-500 bg-base-10 hover:bg-accent-400/15 w-fit transition-colors duration-250 ease-out">
            <Settings2 />
        </button>
        {#if dictionary.id !== $currentDictionary?.id}
            <button onclick={ () => { setToDelete(dictionary.id); } } class="text-base-100 p-2 border-2 rounded-md border-base-40 hover:border-accent-500 bg-base-10 hover:bg-accent-400/15 w-fit transition-colors duration-250 ease-out">
                <Trash2 />
            </button>
        {/if}
    </div>
</div>