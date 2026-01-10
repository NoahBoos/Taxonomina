<script lang="ts">
    import {currentInspectorStateStore, setCurrentInspectorState} from "@/renderer/stores/currentInspectorStateStore";
    import {settings} from "@/renderer/stores/settingsStore";
    import SubmitButton from "@/renderer/components/ui/forms/SubmitButton.svelte";
    import {I_Entry} from "@/shared/interfaces/I_Entry";
    import {EntryService} from "@/renderer/services/EntryService";
    import {INSPECTOR_STATE_PRESETS} from "@/renderer/utils/inspectorStatePresets";
    import EntrySection from "@/renderer/components/features/entry/form/EntrySection.svelte";

    const dictionary_id: number = $settings!.currentDictionary;
    let entry: I_Entry = $state<I_Entry>({id: 0, dictionary_id: dictionary_id, language_id: 0, lemma: ''});

    let submitButtonLabel: string = $derived(entry.id === 0 ? 'Créer' : 'Modifier');

    async function loadEntry() {
        let inspectorState = $currentInspectorStateStore;
        if (inspectorState.category === "content" && inspectorState.id !== undefined) {
            const entry_data = await EntryService.ReadOne(inspectorState.id);
            if (entry_data) {
                Object.assign(entry, entry_data);
            }
        } else {
            entry = {id: 0, dictionary_id: dictionary_id, language_id: 0, lemma: ''};
        }
    }

    async function onSubmit(event: Event) {
        event.preventDefault();
        let _entry = $state.snapshot(entry);

        await EntryService.Save(_entry);

        setCurrentInspectorState(INSPECTOR_STATE_PRESETS.IDLE);
    }

    $effect(() => { loadEntry() });
</script>

<style>

</style>

<form onsubmit={ onSubmit }>
    <EntrySection { dictionary_id } bind:entry />
    <SubmitButton label={ submitButtonLabel } />
</form>