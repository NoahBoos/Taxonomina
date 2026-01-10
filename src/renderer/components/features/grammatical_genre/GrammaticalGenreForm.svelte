<script lang="ts">
    import {currentInspectorStateStore, setCurrentInspectorState} from "@/renderer/stores/currentInspectorStateStore";
    import {settings} from "@/renderer/stores/settingsStore";
    import {I_GrammaticalGenre} from "@/shared/interfaces/I_GrammaticalGenre";
    import {GrammaticalGenreService} from "@/renderer/services/GrammaticalGenreService";
    import {INSPECTOR_STATE_PRESETS} from "@/renderer/utils/inspectorStatePresets";
    import TextInput from "@/renderer/components/ui/forms/TextInput.svelte";
    import SubmitButton from "@/renderer/components/ui/forms/SubmitButton.svelte";

    let grammaticalGenre: I_GrammaticalGenre = $state<I_GrammaticalGenre>({
       id: 0,
       dictionary_id: $settings!.currentDictionary,
       name: ''
    });
    let submitButtonLabel: string = $derived(grammaticalGenre.id === 0 ? "Créer" : "Modifier");

    async function loadGrammaticalGenre() {
        let inspectorState = $currentInspectorStateStore;
        if (inspectorState.category === "content" && inspectorState.id !== undefined) {
            const data = await GrammaticalGenreService.ReadOne(inspectorState.id);
            if (data) Object.assign(grammaticalGenre, data);
        } else {
            grammaticalGenre.id = 0;
            grammaticalGenre.dictionary_id = $settings!.currentDictionary;
            grammaticalGenre.name = '';
        }
    }

    async function onSubmit() {
        await GrammaticalGenreService.Save($state.snapshot(grammaticalGenre));
        setCurrentInspectorState(INSPECTOR_STATE_PRESETS.IDLE);
    }

    $effect(() => { loadGrammaticalGenre(); });
</script>

<style>

</style>

<form onsubmit={ onSubmit }>
    <TextInput name="name" label="Nom" placeholder="Féminin, masculin, neutre..." bind:value={ grammaticalGenre.name } />
    <SubmitButton label={ submitButtonLabel } />
</form>