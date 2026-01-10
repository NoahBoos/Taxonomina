<script lang="ts">
    import {currentInspectorStateStore, setCurrentInspectorState} from "@/renderer/stores/currentInspectorStateStore";
    import {settings} from "@/renderer/stores/settingsStore";
    import {I_GrammaticalClass} from "@/shared/interfaces/I_GrammaticalClass";
    import {GrammaticalClassService} from "@/renderer/services/GrammaticalClassService";
    import {INSPECTOR_STATE_PRESETS} from "@/renderer/utils/inspectorStatePresets";
    import TextInput from "@/renderer/components/ui/forms/TextInput.svelte";
    import SubmitButton from "@/renderer/components/ui/forms/SubmitButton.svelte";

    const dictionary_id: number = $settings!.currentDictionary;

    let grammatical_class: I_GrammaticalClass = $state<I_GrammaticalClass>({ id: 0, dictionary_id: dictionary_id, name: '' });

    let is_submitting: boolean = $state(false);
    let submit_button_label: string = $derived(grammatical_class.id === 0 ? "Créer" : "Modifier");

    async function loadGrammaticalClass() {
        let inspectorState = $currentInspectorStateStore;

        if (inspectorState.category === "content" && inspectorState.id !== undefined) {
            const data = await GrammaticalClassService.ReadOne(inspectorState.id);
            if (data) Object.assign(grammatical_class, data);
        } else {
            grammatical_class = { id: 0, dictionary_id: dictionary_id, name: '' };
        }
    }

    async function onSubmit(event: Event) {
        event.preventDefault();
        if (is_submitting) return;
        is_submitting = true;

        try {
            const grammaticalClassToSave = $state.snapshot(grammatical_class);
            const [success, savedGrammaticalGenre] = await GrammaticalClassService.Save(grammaticalClassToSave);
            if (!success || !savedGrammaticalGenre) throw new Error("Failed to save the grammatical class.");

            setCurrentInspectorState(INSPECTOR_STATE_PRESETS.IDLE);
        } catch (error) {
            console.error("An error occured during the process : ", error);
        } finally {
            is_submitting = false;
        }
    }

    $effect(() => { loadGrammaticalClass(); });
</script>

<style>

</style>

<form onsubmit={ onSubmit }>
    <TextInput name="name" label="Nom" placeholder="Adjectif, mot, verbe... ?" bind:value={ grammatical_class.name } />
    <SubmitButton label={ submit_button_label } />
</form>