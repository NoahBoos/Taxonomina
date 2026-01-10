<script lang="ts">
    import {currentInspectorStateStore, setCurrentInspectorState} from "@/renderer/stores/currentInspectorStateStore";
    import {settings} from "@/renderer/stores/settingsStore";
    import SubmitButton from "@/renderer/components/ui/forms/SubmitButton.svelte";
    import {I_Entry} from "@/shared/interfaces/I_Entry";
    import {EntryService} from "@/renderer/services/EntryService";
    import {INSPECTOR_STATE_PRESETS} from "@/renderer/utils/inspectorStatePresets";
    import EntrySection from "@/renderer/components/features/entry/form/EntrySection.svelte";

    const dictionary_id: number = $settings!.currentDictionary;

    let entry: I_Entry = $state<I_Entry>({
        id: 0,
        dictionary_id: dictionary_id,
        language_id: 0,
        lemma: ''
    });

    let is_submitting: boolean = $state(false);
    let submit_button_label: string = $derived(entry.id === 0 ? 'Créer' : 'Modifier');

    async function loadEntry() {
        let inspectorState = $currentInspectorStateStore;

        if (inspectorState.category === "content" && inspectorState.id !== undefined) {
            const data = await EntryService.ReadOne(inspectorState.id);
            if (data) Object.assign(entry, data);
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
            await EntryService.Save(entryToSave);

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
    <SubmitButton label={ submit_button_label } />
</form>