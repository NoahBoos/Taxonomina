<script lang="ts">
    import {currentInspectorStateStore, setCurrentInspectorState} from "@/renderer/stores/currentInspectorStateStore";
    import {settings} from "@/renderer/stores/settingsStore";
    import {I_GrammaticalClass} from "@/shared/interfaces/I_GrammaticalClass";
    import {GrammaticalClassService} from "@/renderer/services/GrammaticalClassService";
    import {INSPECTOR_STATE_PRESETS} from "@/renderer/utils/inspectorStatePresets";
    import TextInput from "@/renderer/components/ui/forms/TextInput.svelte";
    import SubmitButton from "@/renderer/components/ui/forms/SubmitButton.svelte";

    let grammaticalClass: I_GrammaticalClass = $state<I_GrammaticalClass>({
        id: 0,
        dictionary_id: $settings!.currentDictionary,
        name: ''
    });
    let submitButtonLabel: string = $derived(grammaticalClass.id === 0 ? "Créer" : "Modifier");

    async function loadGrammaticalClass() {
        let inspectorState = $currentInspectorStateStore;
        if (inspectorState.category === "content" && inspectorState.id !== undefined) {
            const data = await GrammaticalClassService.ReadOne(inspectorState.id);
            if (data) Object.assign(grammaticalClass, data);
        } else {
            grammaticalClass.id = 0;
            grammaticalClass.dictionary_id = $settings!.currentDictionary;
            grammaticalClass.name = '';
        }
    }

    async function onSubmit() {
        await GrammaticalClassService.Save($state.snapshot(grammaticalClass));
        setCurrentInspectorState(INSPECTOR_STATE_PRESETS.IDLE);
    }

    $effect(() => { loadGrammaticalClass(); });
</script>

<style>

</style>

<form onsubmit={ onSubmit }>
    <TextInput name="name" label="Nom" placeholder="Adjectif, mot, verbe... ?" bind:value={ grammaticalClass.name } />
    <SubmitButton label={ submitButtonLabel } />
</form>