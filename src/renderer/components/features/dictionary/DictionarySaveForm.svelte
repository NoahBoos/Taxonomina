<script lang="ts">
    import { dictionaryModalStateStore, setToList } from "@/renderer/stores/dictionaryModalStateStore";
    import { I_Dictionary } from "@/shared/interfaces/I_Dictionary";
    import { DictionaryService } from "@/renderer/services/DictionaryService";
    import TextInput from "@/renderer/components/ui/forms/TextInput.svelte";
    import SubmitButton from "@/renderer/components/ui/forms/SubmitButton.svelte";
    import { Undo2 } from "@lucide/svelte";
    import IconButton from "@/renderer/components/ui/interactive/IconButton.svelte";
    import { FormValidationError } from "@/shared/errors/FormValidationError";
    import { refreshDictionaries } from "@/renderer/stores/dictionariesStore";
    import {
        dictionaryFormErrorsStore,
        resetDictionaryFormErrors,
        setDictionaryFormErrors
    } from "@/renderer/stores/dictionaryFormErrorsStore";

    let dictionary: I_Dictionary = $state<I_Dictionary>({ id: 0, name: "", description: "" });

    let is_submitting: boolean = $state(false);
    let submit_button_label: string = $derived(dictionary.id === 0 ? "Créer" : "Modifier");

    let name_errors = $derived($dictionaryFormErrorsStore.filter((e) => e.target.type === 'form_field' && e.target.field_name === 'name'));

    async function loadDictionary(): Promise<void> {
        if ($dictionaryModalStateStore.state === "list" || $dictionaryModalStateStore.state === "delete") return;
        if ($dictionaryModalStateStore.id !== 0) dictionary = await DictionaryService.readOne($dictionaryModalStateStore.id);
    }

    async function onSubmit(event: Event): Promise<void> {
        event.preventDefault();
        if (is_submitting) return;
        is_submitting = true;

        try {
            const dictionaryToSave = $state.snapshot(dictionary);
            const [success, savedDictionary, errors] = await DictionaryService.save(dictionaryToSave);
            if (!success || !savedDictionary) throw new FormValidationError("Failed to save the dictionary.", 'dictionary', errors);

            await refreshDictionaries();

            setToList();
        } catch (error) {
            if (error instanceof FormValidationError) {
                if (error.cause === 'dictionary') {
                    setDictionaryFormErrors(error.errors);
                }
            }
        } finally {
            is_submitting = false;
        }
    }

    $effect(() => {
        loadDictionary();
        resetDictionaryFormErrors();
    })
</script>

<style lang="postcss">

</style>

<div>
    <div class="flex flex-row items-center justify-between mb-4">
        {#if dictionary.id === 0}
            <h2>Créer un nouveau dictionnaire</h2>
        {:else}
            <h2>Modifier un dictionnaire : { dictionary.name }</h2>
        {/if}
        <IconButton icon={ Undo2 } onClick={() => { setToList(); }} />
    </div>
    <form onsubmit={ onSubmit } class="flex flex-col gap-4">
        <TextInput name="name" label="Nom" placeholder="Mon dictionnaire" bind:value={ dictionary.name } errors={ name_errors } />
        <TextInput name="description" label="Description" placeholder="C'est mon superbe dictionnaire !" bind:value={ dictionary.description } />
        <SubmitButton label={ submit_button_label } />
    </form>
</div>