<script lang="ts">
    import { I_Entry } from "@/shared/interfaces/I_Entry";
    import { settings } from "@/renderer/stores/settingsStore";
    import { currentInspectorStateStore } from "@/renderer/stores/currentInspectorStateStore";
    import { EntryService } from "@/renderer/services/EntryService";
    import { I_Definition } from "@/shared/interfaces/I_Definition";
    import { GrammaticalClassService } from "@/renderer/services/GrammaticalClassService";
    import { GrammaticalGenreService } from "@/renderer/services/GrammaticalGenreService";
    import { DefinitionService } from "@/renderer/services/DefinitionService";
    import { I_GrammaticalGenre } from "@/shared/interfaces/I_GrammaticalGenre";
    import { I_GrammaticalClass } from "@/shared/interfaces/I_GrammaticalClass";

    const dictionary_id: number = $settings!.currentDictionary;

    let entry: I_Entry = $state<I_Entry>({ id: 0, dictionary_id: dictionary_id, language_id: 0, lemma: '' });
    let grammatical_classes: I_GrammaticalClass[] = $state([]);
    let grammatical_genres: I_GrammaticalGenre[] = $state([]);
    let translations: I_Entry[] = $state([]);
    let definitions: I_Definition[] = $state([]);

    async function loadEntry() {
        let inspectorState = $currentInspectorStateStore;

        if (inspectorState.category === "content" && inspectorState.id !== undefined) {
            const data = await EntryService.readOne(inspectorState.id);
            if (data) {
                Object.assign(entry, data);
                grammatical_classes = await GrammaticalClassService.readAllByEntry(entry.id);
                grammatical_genres = await GrammaticalGenreService.readAllByEntry(entry.id);
                translations = await EntryService.readAllByGlobalTranslation(entry.id);
                definitions = await DefinitionService.readAllByEntry(entry.id);
            }
        } else {
            entry = { id: 0, dictionary_id: dictionary_id, language_id: 0, lemma: '' };
        }
    }

    $effect(() => {
        loadEntry();
    });
</script>

<style>

</style>

<div>
    {#if entry.id === 0}
        <p>L'entrée demandée n'a pas été trouvé.</p>
    {:else}
        <p>L'entrée demandée a été trouvé : { entry.lemma }</p>
    {/if}
</div>