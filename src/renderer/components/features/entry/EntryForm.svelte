<script lang="ts">
    import {currentInspectorStateStore, setCurrentInspectorState} from "@/renderer/stores/currentInspectorStateStore";
    import {settings} from "@/renderer/stores/settingsStore";
    import SubmitButton from "@/renderer/components/ui/forms/SubmitButton.svelte";
    import {I_Entry} from "@/shared/interfaces/I_Entry";
    import {EntryService} from "@/renderer/services/EntryService";
    import {INSPECTOR_STATE_PRESETS} from "@/renderer/utils/inspectorStatePresets";
    import EntrySection from "@/renderer/components/features/entry/form/EntrySection.svelte";
    import GrammaticalClassSection from "@/renderer/components/features/entry/form/GrammaticalClassSection.svelte";
    import {I_GrammaticalClass} from "@/shared/interfaces/I_GrammaticalClass";
    import {GrammaticalClassService} from "@/renderer/services/GrammaticalClassService";
    import {I_GrammaticalGenre} from "@/shared/interfaces/I_GrammaticalGenre";
    import {GrammaticalGenreService} from "@/renderer/services/GrammaticalGenreService";
    import GrammaticalGenreSection from "@/renderer/components/features/entry/form/GrammaticalGenreSection.svelte";

    const dictionary_id: number = $settings!.currentDictionary;

    let entry = $state<I_Entry>({
        id: 0,
        dictionary_id: dictionary_id,
        language_id: 0,
        lemma: ''
    });
    let selected_grammatical_classes = $state<I_GrammaticalClass[]>([]);
    let selected_grammatical_genres = $state<I_GrammaticalGenre[]>([]);

    let is_submitting: boolean = $state(false);
    let submit_button_label: string = $derived(entry.id === 0 ? 'Créer' : 'Modifier');

    async function loadEntry() {
        let inspectorState = $currentInspectorStateStore;

        if (inspectorState.category === "content" && inspectorState.id !== undefined) {
            const data = await EntryService.ReadOne(inspectorState.id);
            if (data) {
                Object.assign(entry, data);
                selected_grammatical_classes = await GrammaticalClassService.ReadAllByEntry(data);
                selected_grammatical_genres = await GrammaticalGenreService.ReadAllByEntry(data);
            }
        } else {
            entry = { id: 0, dictionary_id: dictionary_id, language_id: 0, lemma: '' };
        }
    }

    async function onSubmit(event: Event) {
        event.preventDefault();
        if (is_submitting) return;
        is_submitting = true;

        try {
            const entryToSave = $state.snapshot(entry);
            const selectedGrammaticalClasses = $state.snapshot(selected_grammatical_classes);
            const selectedGrammaticalGenres = $state.snapshot(selected_grammatical_genres);
            const [success, savedEntry] = await EntryService.Save(entryToSave);
            if (!success || !savedEntry) throw new Error("Failed to save the entry.")

            if (entryToSave.id !== 0) {
                let [old_grammatical_classes, old_grammatical_genres] = await Promise.all([
                    await GrammaticalClassService.ReadAllByEntry(savedEntry),
                    await GrammaticalGenreService.ReadAllByEntry(savedEntry)
                ]);
                old_grammatical_classes.forEach(gc => EntryService.UnbindFromGrammaticalClass(savedEntry, gc));
                old_grammatical_genres.forEach(gg => EntryService.UnbindFromGrammaticalGenre(savedEntry, gg));
            }

            selectedGrammaticalClasses.forEach(gc => EntryService.BindToGrammaticalClass(savedEntry, gc));
            selectedGrammaticalGenres.forEach(gg => EntryService.BindToGrammaticalGenre(savedEntry, gg));

            setCurrentInspectorState(INSPECTOR_STATE_PRESETS.IDLE);
        } catch (error) {
            console.error("An error occurred during the process :", error);
        } finally {
            is_submitting = false;
        }
    }

    $effect(() => { loadEntry() });
</script>

<style>

</style>

<form onsubmit={ onSubmit }>
    <EntrySection { dictionary_id } bind:entry />
    <div>
        <GrammaticalClassSection { dictionary_id } bind:selected_grammatical_classes />
        <GrammaticalGenreSection { dictionary_id } bind:selected_grammatical_genres />
    </div>
    <SubmitButton label={ submit_button_label } />
</form>