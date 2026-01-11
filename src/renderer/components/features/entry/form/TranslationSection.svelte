<script lang="ts">
    import {I_Entry} from "@/shared/interfaces/I_Entry";
    import {EntryService} from "@/renderer/services/EntryService";
    import Searchbar from "@/renderer/components/ui/forms/Searchbar.svelte";
    import FloatingList from "@/renderer/components/ui/display/FloatingList.svelte";
    import FloatingListItem from "@/renderer/components/ui/interactive/FloatingListItem.svelte";
    import Tag from "@/renderer/components/ui/display/Tag.svelte";

    interface Props {
        dictionary_id: number;
        selected_translations: I_Entry[];
        entry?: I_Entry;
    }

    let { dictionary_id, selected_translations = $bindable([]), entry = $bindable() }: Props = $props();

    let query = $state('');
    let translation_suggestions = $state<I_Entry[]>([]);

    let is_searching = $state(false);
    let show_dropdown = $derived(query.length > 0 && translation_suggestions.length > 0);

    function addTranslation(translation: I_Entry) {
        if (!selected_translations.some(t => t.id === translation.id)) selected_translations.push(translation);
        query = '';
        translation_suggestions = [];
    }

    function removeTranslation(translation: I_Entry) {
        selected_translations = selected_translations.filter(t => t.id !== translation.id);
    }

    $effect(() => {
        const _query = query;
        const timer = setTimeout(async () => {
            if (_query.trim().length > 1) {
                is_searching = true;

                translation_suggestions = (await EntryService.ReadAll(dictionary_id)).filter((looped_translation: I_Entry) => {
                    return looped_translation.lemma.toLowerCase().includes(_query.toLowerCase())
                        && !selected_translations.some(translation => translation.id === looped_translation.id)
                        && looped_translation.id !== entry?.id;
                }).sort((a, b) => a.lemma.localeCompare(b.lemma)).slice(0, 10);

                is_searching = false;
            } else {
                translation_suggestions = [];
            }
        }, 200);

        return () => clearTimeout(timer);
    });
</script>

<style>

</style>

<div>
    <div>
        <Searchbar placeholder="Rechercher une traduction..." bind:query />
        <FloatingList visible={ show_dropdown }>
            {#each translation_suggestions as translation}
                <FloatingListItem label={ translation.lemma } onClick={ () => addTranslation(translation) } />
            {/each}
        </FloatingList>
    </div>
    <div>
        {#each selected_translations as translation}
            <Tag label={ translation.lemma } onRemove={ () => removeTranslation(translation) } />
        {/each}
    </div>
</div>