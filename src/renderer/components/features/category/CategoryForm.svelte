<script lang="ts">
    import { settings } from "@/renderer/stores/settingsStore";
    import { I_Category } from "@/shared/interfaces/I_Category";
    import {
        categoryFormErrorsStore,
        resetCategoryFormErrors,
        setCategoryFormErrors
    } from "@/renderer/stores/categoryFormErrorsStore";
    import { currentInspectorStateStore, setCurrentInspectorState } from "@/renderer/stores/currentInspectorStateStore";
    import { CategoryService } from "@/renderer/services/CategoryService";
    import { refreshCategories } from "@/renderer/stores/categoriesStore";
    import { INSPECTOR_STATE_PRESETS } from "@/renderer/utils/inspectorStatePresets";
    import { ErrorDomain, TaxonominaError } from "@/shared/errors/types";
    import TextInput from "@/renderer/components/ui/forms/TextInput.svelte";
    import SubmitButton from "@/renderer/components/ui/forms/SubmitButton.svelte";

    const dictionary_id: number = $settings!.currentDictionary;

    let category: I_Category = $state<I_Category>({ id: 0, dictionary_id: dictionary_id, name: "" })

    let is_submitting: boolean = $state(false);
    let submit_mode: 'save' | 'save-and-new' = $state('save');
    let submit_button_label: string = $derived(category.id == 0 ? 'Créer' : 'Modifier');

    let name_errors = $derived($categoryFormErrorsStore.filter((e) => e.target.type === 'form_field' && e.target.field_name === 'name'));

    async function loadCategory() {
        let inspectorState = $currentInspectorStateStore;

        if (inspectorState.category === 'content' && inspectorState.id !== undefined) {
            const data = await CategoryService.readOne(inspectorState.id);
            if (data) Object.assign(category, data);
        } else {
            category = { id: 0, dictionary_id: dictionary_id, name: "" };
        }
    }

    async function onSubmit(event: Event) {
        event.preventDefault();
        if (is_submitting) return;
        is_submitting = true;

        try {
            const _category = $state.snapshot(category);
            const [success, savedCategory, errors] = await CategoryService.save(_category);
            if (!success || !savedCategory) throw new Error('Failed to save the grammatical class.', { cause: errors });

            await refreshCategories();

            if (submit_mode === 'save') {
                setCurrentInspectorState(INSPECTOR_STATE_PRESETS.CONTENT.CATEGORY.READ_ONE(savedCategory.id));
            } else {
                setCurrentInspectorState(INSPECTOR_STATE_PRESETS.CONTENT.CATEGORY.CREATE);
            }
        } catch (error) {
            if (error instanceof Error) {
                let errors = error.cause as TaxonominaError<ErrorDomain>[];
                setCategoryFormErrors(errors);
            }
        } finally {
            is_submitting = false;
        }
    }

    $effect(() => {
        loadCategory();
        resetCategoryFormErrors();
    });
</script>

{#key category.id}
    <div class="flex flex-col gap-4 mx-auto w-[85%]">
        {#if category.id === 0}
            <h2>Créer une nouvelle catégorie</h2>
        {:else}
            <h2>Modifier une catégorie : { category.name }</h2>
        {/if}
        <form onsubmit={ onSubmit } class="flex flex-col gap-4">
            <TextInput name="name" label="Nom" placeholder="Cuisine, nature, aliments... ?" bind:value={ category.name } errors={ name_errors } />
            <div class="flex flex-row gap-2 mx-auto">
                <SubmitButton onClick={ () => { submit_mode = 'save' } } label={ submit_button_label } variant="uncentered" />
                {#if category.id === 0}
                    <SubmitButton onClick={ () => { submit_mode = 'save-and-new' } } label="Créer et nouvelle catégorie" variant="uncentered" />
                {/if}
            </div>
        </form>
    </div>
{/key}