<script lang="ts">
    import {currentInspectorStateStore, setCurrentInspectorState} from "@/renderer/stores/currentInspectorStateStore";
    import {settings} from "@/renderer/stores/settingsStore";
    import {I_GrammaticalGenre} from "@/shared/interfaces/I_GrammaticalGenre";
    import {GrammaticalGenreService} from "@/renderer/services/GrammaticalGenreService";
    import {INSPECTOR_STATE_PRESETS} from "@/renderer/utils/inspectorStatePresets";
    import TextInput from "@/renderer/components/ui/forms/TextInput.svelte";
    import SubmitButton from "@/renderer/components/ui/forms/SubmitButton.svelte";

    const dictionary_id: number = $settings!.currentDictionary;

    let grammatical_genre: I_GrammaticalGenre = $state<I_GrammaticalGenre>({ id: 0, dictionary_id: dictionary_id, name: '' });

    let is_submitting: boolean = $state(false);
    let submit_button_label: string = $derived(grammatical_genre.id === 0 ? "Créer" : "Modifier");

    async function loadGrammaticalGenre() {
        let inspectorState = $currentInspectorStateStore;

        if (inspectorState.category === "content" && inspectorState.id !== undefined) {
            const data = await GrammaticalGenreService.ReadOne(inspectorState.id);
            if (data) Object.assign(grammatical_genre, data);
        } else {
            grammatical_genre = { id: 0, dictionary_id: dictionary_id, name: '' };
        }
    }

    async function onSubmit(event: Event) {
        event.preventDefault();
        if (is_submitting) return;
        is_submitting = true;

        try {
            const grammaticalGenreToSave = $state.snapshot(grammatical_genre);
            const [success, savedGrammaticalGenre] = await GrammaticalGenreService.Save(grammaticalGenreToSave);
            if (!success || !savedGrammaticalGenre) throw new Error("Failed to save the grammatical genre.");

            setCurrentInspectorState(INSPECTOR_STATE_PRESETS.IDLE);
        } catch (error) {
            console.error("An error occurred during the process :", error);
        } finally {
            is_submitting = false;
        }
    }

    $effect(() => { loadGrammaticalGenre(); });
</script>

<style>

</style>

<form onsubmit={ onSubmit }>
    <TextInput name="name" label="Nom" placeholder="Féminin, masculin, neutre..." bind:value={ grammatical_genre.name } />
    <SubmitButton label={ submit_button_label } />
</form>