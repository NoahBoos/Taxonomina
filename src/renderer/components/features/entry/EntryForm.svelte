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
    import TranslationSection from "@/renderer/components/features/entry/form/TranslationSection.svelte";
    import DefinitionSection from "@/renderer/components/features/entry/form/DefinitionSection.svelte";
    import {I_Definition} from "@/shared/interfaces/I_Definition";
    import {DefinitionService} from "@/renderer/services/DefinitionService";
    import { Tags } from "@lucide/svelte";
    import { refreshEntries } from "@/renderer/stores/entriesStore";
    import { ErrorDomain, TaxonominaError } from "@/shared/errors/types";
    import { resetEntryFormErrors, setEntryFormErrors } from "@/renderer/stores/entryFormErrorsStore";
    import { resetDefinitionFormErrors, setDefinitionFormErrors } from "@/renderer/stores/definitionFormErrorsStore";
    import { FormValidationError } from "@/shared/errors/FormValidationError";

    const dictionary_id: number = $settings!.currentDictionary;

    let entry = $state<I_Entry>({ id: 0, dictionary_id: dictionary_id, language_id: 0, lemma: '', definitions: [], grammatical_classes: [], grammatical_genres: [], language: undefined, translations: [] });
    let old_entry: I_Entry | undefined = $state(undefined);

    let is_submitting: boolean = $state(false);
    let submit_mode: 'save' | 'save-and-new' = $state('save');
    let submit_button_label: string = $derived(entry.id === 0 ? 'Créer' : 'Modifier');

    async function loadEntry() {
        let inspectorState = $currentInspectorStateStore;

        if (inspectorState.category === "content" && inspectorState.id !== undefined) {
            let data = await EntryService.readOne(inspectorState.id);
            entry = {
                ...data,
                grammatical_classes: data.grammatical_classes ?? [],
                grammatical_genres: data.grammatical_genres ?? [],
                translations: data.translations ?? [],
                definitions: data.definitions ?? [],
            };
            old_entry = {...entry};
        } else {
            entry = { id: 0, dictionary_id: dictionary_id, language_id: 0, lemma: '', definitions: [], grammatical_classes: [], grammatical_genres: [], language: undefined, translations: [] };
        }
    }

    async function onSubmit(event: Event) {
        event.preventDefault();
        if (is_submitting) return;
        is_submitting = true;

        try {
            const _entry = $state.snapshot(entry);
            _entry.definitions = _entry.definitions?.filter(d => d.definition.trim() !== '' && d.definition.trim() !== ' ');
            const [success, savedEntry, errors] = await EntryService.save(_entry);
            if (!success || !savedEntry) throw new FormValidationError("Failed to save the entry.", 'entry', errors);

            if (old_entry && old_entry.id !== 0) {
                old_entry.grammatical_classes.forEach(gc => EntryService.unbindFromGrammaticalClass(savedEntry.id, gc.id));
                old_entry.grammatical_genres.forEach(gg => EntryService.unbindFromGrammaticalGenre(savedEntry.id, gg.id));
                old_entry.translations.forEach(e => EntryService.unbindFromTranslation(savedEntry.id, e.id));
                for (const d of old_entry.definitions) {
                    await DefinitionService.unbindFromTranslation(d.id, savedEntry.id);
                    if (_entry.definitions?.every(sd => sd.id !== d.id)) await DefinitionService.delete(d.id);
                }
            }

            _entry.grammatical_classes?.forEach(gc => EntryService.bindToGrammaticalClass(savedEntry.id, gc.id));
            _entry.grammatical_genres?.forEach(gg => EntryService.bindToGrammaticalGenre(savedEntry.id, gg.id));
            _entry.translations?.forEach(e => EntryService.bindToTranslation(savedEntry.id, e.id));
            let definitionErrors: TaxonominaError<ErrorDomain>[] = [];
            for (const d of _entry.definitions ?? [] as I_Definition[]) {
                const [success, savedDefinition, errors] = await DefinitionService.save(d);

                if (!success) {
                    errors.forEach(e => definitionErrors.push(e));
                    continue;
                }

                if (!definitionErrors.some(e => e.target.type === 'form_field' && e.target.field_name === d.clientKey)) {
                    await DefinitionService.bindToTranslation(savedDefinition!.id, savedEntry.id);
                }
            }
            if (definitionErrors.length !== 0) throw new FormValidationError('Failed to save the definitions', 'definitions', definitionErrors);

            await refreshEntries();

            if (submit_mode === 'save') {
                setCurrentInspectorState(INSPECTOR_STATE_PRESETS.CONTENT.ENTRY.READ_ONE(savedEntry.id));
            } else if (submit_mode === 'save-and-new') {
                setCurrentInspectorState(INSPECTOR_STATE_PRESETS.CONTENT.ENTRY.CREATE);
            }
        } catch (error) {
            if (error instanceof FormValidationError) {
                let errors = error.errors;
                if (error.cause === 'entry') {
                    setEntryFormErrors(errors);
                } else if (error.cause === 'definitions') {
                    setDefinitionFormErrors(errors);
                }
            }
        } finally {
            is_submitting = false;
        }
    }

    $effect(() => {
        loadEntry();
        resetEntryFormErrors();
        resetDefinitionFormErrors();
    });
</script>

<style>

</style>

{#key entry.id}
    <div class="flex flex-col gap-4 mx-auto w-[85%]">
        {#if entry.id === 0}
            <h2>Créer une nouvelle entrée</h2>
        {:else}
            <h2>Modifier une entrée : { entry.lemma }</h2>
        {/if}
        <form onsubmit={ onSubmit } class="flex flex-col gap-4">
            <EntrySection { dictionary_id } bind:entry />
            <div class="space-y-2">
                <div class="flex flex-row items-center gap-2">
                    <Tags />
                    <h3>Catégorisations</h3>
                </div>
                <GrammaticalClassSection { dictionary_id } bind:selected_grammatical_classes={ entry.grammatical_classes } is_lockable={ entry.id === 0 } />
                <GrammaticalGenreSection { dictionary_id } bind:selected_grammatical_genres={ entry.grammatical_genres } is_lockable={ entry.id === 0 } />
            </div>
            <TranslationSection { dictionary_id } bind:selected_translations={ entry.translations } bind:entry />
            <DefinitionSection bind:selected_definitions={ entry.definitions } />
            <div class="flex flex-row gap-2 mx-auto">
                <SubmitButton onClick={ () => { submit_mode = 'save' } } label={ submit_button_label } variant="uncentered" />
                {#if entry.id === 0}
                    <SubmitButton onClick={ () => { submit_mode = 'save-and-new' } } label="Créer et nouvelle entrée" variant="uncentered" />
                {/if}
            </div>
        </form>
    </div>
{/key}
