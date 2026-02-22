<script lang="ts">
    import {currentInspectorStateStore, setCurrentInspectorState} from "@/renderer/stores/currentInspectorStateStore";
    import {settings} from "@/renderer/stores/settingsStore";
    import {I_GrammaticalGenre} from "@/shared/interfaces/I_GrammaticalGenre";
    import {GrammaticalGenreService} from "@/renderer/services/GrammaticalGenreService";
    import {INSPECTOR_STATE_PRESETS} from "@/renderer/utils/inspectorStatePresets";
    import TextInput from "@/renderer/components/ui/forms/TextInput.svelte";
    import SubmitButton from "@/renderer/components/ui/forms/SubmitButton.svelte";
    import { refreshGrammaticalGenres } from "@/renderer/stores/grammaticalGenresStore";
    import {
        grammaticalGenreFormErrorsStore, resetGrammaticalGenreFormErrors,
        setGrammaticalGenreFormErrors
    } from "@/renderer/stores/grammaticalGenreFormErrorsStore";
    import { ErrorDomain, TaxonominaError } from "@/shared/errors/types";

    const dictionary_id: number = $settings!.currentDictionary;

    let grammatical_genre: I_GrammaticalGenre = $state<I_GrammaticalGenre>({ id: 0, dictionary_id: dictionary_id, name: '' });

    let is_submitting: boolean = $state(false);
    let submit_button_label: string = $derived(grammatical_genre.id === 0 ? "Créer" : "Modifier");

    let name_errors = $derived($grammaticalGenreFormErrorsStore.filter((e) => e.target.type === 'form_field' && e.target.field_name === 'name'));

    async function loadGrammaticalGenre() {
        let inspectorState = $currentInspectorStateStore;

        if (inspectorState.category === "content" && inspectorState.id !== undefined) {
            const data = await GrammaticalGenreService.readOne(inspectorState.id);
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
            const [success, savedGrammaticalGenre, errors] = await GrammaticalGenreService.save(grammaticalGenreToSave);
            if (!success || !savedGrammaticalGenre) throw new Error("Failed to save the grammatical genre.", { cause: errors });

            await refreshGrammaticalGenres();

            setCurrentInspectorState(INSPECTOR_STATE_PRESETS.CONTENT.GRAMMATICAL_GENRE.READ_ONE(savedGrammaticalGenre.id));
        } catch (error) {
            if (error instanceof Error) {
                let errors = error.cause as TaxonominaError<ErrorDomain>[];
                setGrammaticalGenreFormErrors(errors);
            }
        } finally {
            is_submitting = false;
        }
    }

    $effect(() => {
        loadGrammaticalGenre();
        resetGrammaticalGenreFormErrors();
    });
</script>

<style>

</style>

{#key grammatical_genre.id}
    <div class="flex flex-col gap-4 mx-auto w-[85%]">
        {#if grammatical_genre.id === 0}
            <h2>Créer un nouveau genre grammatical</h2>
        {:else}
            <h2>Modifier un genre grammatical : { grammatical_genre.name }</h2>
        {/if}
        <form onsubmit={ onSubmit } class="flex flex-col gap-4">
            <TextInput name="name" label="Nom" placeholder="Féminin, masculin, neutre..." bind:value={ grammatical_genre.name } errors={ name_errors } />
            <SubmitButton label={ submit_button_label } />
        </form>
    </div>
{/key}