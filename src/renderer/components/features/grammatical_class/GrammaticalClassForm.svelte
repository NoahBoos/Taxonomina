<script lang="ts">
    import {currentInspectorStateStore, setCurrentInspectorState} from "@/renderer/stores/currentInspectorStateStore";
    import {settings} from "@/renderer/stores/settingsStore";
    import {I_GrammaticalClass} from "@/shared/interfaces/I_GrammaticalClass";
    import {GrammaticalClassService} from "@/renderer/services/GrammaticalClassService";
    import {INSPECTOR_STATE_PRESETS} from "@/renderer/utils/inspectorStatePresets";
    import TextInput from "@/renderer/components/ui/forms/TextInput.svelte";
    import SubmitButton from "@/renderer/components/ui/forms/SubmitButton.svelte";
    import { refreshGrammaticalClasses } from "@/renderer/stores/grammaticalClassesStore";
    import {
        grammaticalClassFormErrorsStore, resetGrammaticalClassFormErrors,
        setGrammaticalClassFormErrors
    } from "@/renderer/stores/grammaticalClassFormErrorsStore";
    import { ErrorDomain, TaxonominaError } from "@/shared/errors/types";

    const dictionary_id: number = $settings!.currentDictionary;

    let grammatical_class: I_GrammaticalClass = $state<I_GrammaticalClass>({ id: 0, dictionary_id: dictionary_id, name: '' });

    let is_submitting: boolean = $state(false);
    let submit_button_label: string = $derived(grammatical_class.id === 0 ? "Créer" : "Modifier");

    let name_errors = $derived($grammaticalClassFormErrorsStore.filter((e) => e.target.type === 'form_field' && e.target.field_name === 'name'));

    async function loadGrammaticalClass() {
        let inspectorState = $currentInspectorStateStore;

        if (inspectorState.category === "content" && inspectorState.id !== undefined) {
            const data = await GrammaticalClassService.readOne(inspectorState.id);
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
            const [success, savedGrammaticalGenre, errors] = await GrammaticalClassService.save(grammaticalClassToSave);
            if (!success || !savedGrammaticalGenre) throw new Error("Failed to save the grammatical class.", { cause: errors });

            await refreshGrammaticalClasses();

            setCurrentInspectorState(INSPECTOR_STATE_PRESETS.IDLE);
        } catch (error) {
            if (error instanceof Error) {
                let errors = error.cause as TaxonominaError<ErrorDomain>[];
                setGrammaticalClassFormErrors(errors);
            }
        } finally {
            is_submitting = false;
        }
    }

    $effect(() => {
        loadGrammaticalClass();
        resetGrammaticalClassFormErrors();
    });
</script>

<style>

</style>

{#key grammatical_class.id}
    <div class="flex flex-col gap-4 mx-auto w-[85%]">
        {#if grammatical_class.id === 0}
            <h2>Créer une nouvelle classe grammaticale</h2>
        {:else}
            <h2>Modifier une classe grammaticale : { grammatical_class.name }</h2>
        {/if}
        <form onsubmit={ onSubmit } class="flex flex-col gap-4">
            <TextInput name="name" label="Nom" placeholder="Adjectif, mot, verbe... ?" bind:value={ grammatical_class.name } errors={ name_errors } />
            <SubmitButton label={ submit_button_label } />
        </form>
    </div>
{/key}