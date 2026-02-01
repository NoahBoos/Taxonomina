<script lang="ts">
    import { toggleShowDictionary } from "@/renderer/stores/showDictionaryStore";
    import DictionaryList from "@/renderer/components/features/dictionary/DictionaryList.svelte";
    import { dictionaryModalStateStore, setToList } from "@/renderer/stores/dictionaryModalStateStore";
    import DictionarySaveForm from "@/renderer/components/features/dictionary/DictionarySaveForm.svelte";
    import DictionaryDeleteForm
        from "@/renderer/components/features/dictionary/DictionaryDeleteForm.svelte";

    function closeDictionaryModal(): void {
        toggleShowDictionary(false);
        setToList();
    }
</script>

<style lang="postcss">
    @reference '../../../styles/styles.css';

    #modal-container {
        @apply fixed inset-0 z-50 flex items-center justify-center bg-black/50;
    }

    #modal {
        @apply w-[60%] h-fit p-4 border-transparent rounded-md shadow-md bg-base-30;
    }
</style>

<!--
    TODO - Accessibilité à développer après le développement de l'interface :
    - Ajustement de l'interprétation de la div racine du composant.
    - Désactivation du focus des éléments n'étant pas la modale (Navigator, Browser et Inspector), quand cette dernière est ouverte.
 -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<!-- svelte-ignore a11y_click_events_have_key_events -->
<div id="modal-container" on:click|self={ closeDictionaryModal }>
    <div id="modal">
        {#if $dictionaryModalStateStore.state === "list"}
            <DictionaryList />
        {:else if $dictionaryModalStateStore.state === "save"}
            <DictionarySaveForm />
        {:else if $dictionaryModalStateStore.state === "delete"}
            <DictionaryDeleteForm />
        {/if}
    </div>
</div>