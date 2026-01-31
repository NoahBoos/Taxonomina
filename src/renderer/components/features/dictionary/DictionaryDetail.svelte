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

<div class="flex flex-row p-2 justify-between border-2 rounded-lg border-base-50 bg-base-40">
    <div class="flex flex-col">
        <p class="text-lg">{ dictionary.name }</p>
        <p>{ dictionary.description }</p>
    </div>
    <div class="flex flex-row gap-2 items-center">
        {#if dictionary.id !== $currentDictionary?.id}
            <button onclick={ () => { setCurrentDictionary(dictionary.id) } } class="text-base-100 hover:text-base-90 px-4 py-2 border-2 rounded-md border-base-50 hover:border-primary-400 bg-base-35 hover:bg-primary-500 w-fit transition-colors duration-250 ease-out">
                Activer
            </button>
        {/if}
        <button onclick={ () => { setToSave(dictionary.id); } } class="text-base-100 hover:text-base-90 p-2 border-2 rounded-md border-base-50 hover:border-primary-400 bg-base-35 hover:bg-primary-500 w-fit transition-colors duration-250 ease-out">
            <Settings2 />
        </button>
        {#if dictionary.id !== $currentDictionary?.id}
            <button onclick={ () => { setToDelete(dictionary.id); } } class="text-base-100 hover:text-base-90 p-2 border-2 rounded-md border-base-50 hover:border-primary-400 bg-base-35 hover:bg-primary-500 w-fit transition-colors duration-250 ease-out">
                <Trash2 />
            </button>
        {/if}
    </div>
</div>