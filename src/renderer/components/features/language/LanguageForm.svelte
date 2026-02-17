<script lang="ts">
    import {currentInspectorStateStore, setCurrentInspectorState} from "@/renderer/stores/currentInspectorStateStore";
    import {settings} from "@/renderer/stores/settingsStore";
    import {I_Language} from "@/shared/interfaces/I_Language";
    import {LanguageService} from "@/renderer/services/LanguageService";
    import TextInput from "@/renderer/components/ui/forms/TextInput.svelte";
    import Checkbox from "@/renderer/components/ui/forms/Checkbox.svelte";
    import Select from "@/renderer/components/ui/forms/Select.svelte";
    import {DIRECTIONS} from "@/renderer/utils/selectOptionPresets";
    import SubmitButton from "@/renderer/components/ui/forms/SubmitButton.svelte";
    import {INSPECTOR_STATE_PRESETS} from "@/renderer/utils/inspectorStatePresets";
    import { refreshLanguages } from "@/renderer/stores/languagesStore";
    import { ErrorDomain, TaxonominaError } from "@/shared/errors/types";
    import { languageFormErrorsStore, resetLanguageFormErrors, setLanguageFormErrors } from "@/renderer/stores/languageFormErrorStore";

    const dictionary_id: number = $settings!.currentDictionary;

    let language: I_Language = $state<I_Language>({
        id: 0,
        dictionary_id: dictionary_id,
        name_native: '',
        name_local: '',
        is_conlang: false,
        iso_639_1: '',
        iso_639_3: '',
        direction: 'ltr'
    });

    let is_submitting: boolean = $state(false);
    let submit_button_label: string = $derived(language.id === 0 ? "Créer" : "Modifier");

    async function loadLanguage() {
        let inspectorState = $currentInspectorStateStore;

        if (inspectorState.category === "content" && inspectorState.id !== undefined) {
            const data = await LanguageService.readOne(inspectorState.id);
            if (data) Object.assign(language, data);
        } else {
            language = {
                id: 0,
                dictionary_id: dictionary_id,
                name_native: '',
                name_local: '',
                is_conlang: false,
                iso_639_1: '',
                iso_639_3: '',
                direction: 'ltr'
            };
        }
    }

    async function onSubmit(event: Event) {
        event.preventDefault();
        if (is_submitting) return;
        is_submitting = true;

        try {
            const languageToSave = $state.snapshot(language);
            const [success, savedLanguage, errors] = await LanguageService.save(languageToSave);
            if (!success || !savedLanguage) throw new Error("Failed to save the language.", { cause: errors });

            await refreshLanguages();

            setCurrentInspectorState(INSPECTOR_STATE_PRESETS.IDLE);
        } catch (error) {
            if (error instanceof Error) {
                let errors = error.cause as TaxonominaError<ErrorDomain>[];
                setLanguageFormErrors(errors);
            }
        } finally {
            is_submitting = false;
        }
    }

    $effect(() => {
        loadLanguage();
        resetLanguageFormErrors();
    });
</script>

<style>

</style>

{#key language.id}
    <div class="flex flex-col gap-4 mx-auto w-[85%]">
        {#if language.id === 0}
            <h2>Créer une nouvelle langue</h2>
        {:else}
            <h2>Modifier une langue : { language.name_native }</h2>
        {/if}
        {#if $languageFormErrorsStore.length > 0 }
            <p>Il y a des erreurs à corriger. ;></p>
        {/if}
        <form onsubmit={ onSubmit } class="flex flex-col gap-4">
            <div class="flex flex-row gap-4">
                <TextInput name="name_native" label="Nom natif" placeholder="Entrez le nom de la langue dans cette dernière." bind:value={ language.name_native }/>
                <TextInput name="name_local" label="Nom local" placeholder="Entrez le nom de la langue dans votre langue." bind:value={ language.name_local } />
            </div>
            <Checkbox name="is_conlang" label="Est-ce que cette langue est une langue construite ?" bind:checked={ language.is_conlang } />
            <div class="flex flex-row gap-4">
                <TextInput name="iso_639_1" label="ISO 639-1" placeholder="Entrez le code ISO 639-1 de la langue." bind:value={ language.iso_639_1 } />
                <TextInput name="iso_639_3" label="ISO 639-3" placeholder="Entrez le code ISO 639-3 de la langue." bind:value={ language.iso_639_3 } />
            </div>
            <Select label="Sens de lecture de la langue" options={ DIRECTIONS } value={ language.direction } />
            <SubmitButton label={ submit_button_label } />
        </form>
    </div>
{/key}