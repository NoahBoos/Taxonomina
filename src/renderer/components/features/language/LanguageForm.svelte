<script lang="ts">
    import {currentInspectorStateStore, setCurrentInspectorState} from "@/renderer/stores/currentInspectorStateStore";
    import {settings} from "@/renderer/stores/settingsStore";
    import {I_Language} from "@/shared/interfaces/I_Language";
    import {LanguageService} from "@/renderer/services/LanguageService";
    import TextInput from "@/renderer/components/ui/forms/TextInput.svelte";
    import Checkbox from "@/renderer/components/ui/forms/Checkbox.svelte";
    import Select from "@/renderer/components/ui/forms/Select.svelte";
    import {DIRECTION} from "@/renderer/utils/selectOptionPresets";
    import SubmitButton from "@/renderer/components/ui/forms/SubmitButton.svelte";
    import {INSPECTOR_STATE_PRESETS} from "@/renderer/utils/inspectorStatePresets";

    let language: I_Language = $state<I_Language>({
        id: 0,
        dictionary_id: $settings!.currentDictionary,
        name_native: '',
        name_local: '',
        is_conlang: false,
        iso_639_1: '',
        iso_639_3: '',
        direction: 'ltr'
    });
    let submitButtonLabel: string = $derived(language.id === 0 ? "Créer" : "Modifier");

    async function loadLanguage() {
        let inspectorState = $currentInspectorStateStore;
        if (inspectorState.category === "content" && inspectorState.id !== undefined) {
            const data = await LanguageService.ReadOne(inspectorState.id);
            console.log(data.id);
            if (data) Object.assign(language, data);
        } else {
            language.id = 0;
            language.dictionary_id = $settings!.currentDictionary;
            language.name_native = '';
            language.name_local = '';
            language.is_conlang = false;
            language.iso_639_1 = '';
            language.iso_639_3 = '';
            language.direction = 'ltr';
        }
    }

    async function onSubmit() {
        await LanguageService.Save($state.snapshot(language));
        setCurrentInspectorState(INSPECTOR_STATE_PRESETS.IDLE);
    }

    $effect(() => { loadLanguage(); });
</script>

<style>

</style>

<form onsubmit={ onSubmit }>
    <div>
        <TextInput name="name_native" label="Nom natif" placeholder="Entrez le nom de la langue dans cette dernière." bind:value={ language.name_native }/>
        <TextInput name="name_local" label="Nom local" placeholder="Entrez le nom de la langue dans votre langue." bind:value={ language.name_local } />
    </div>
    <Checkbox name="is_conlang" label="Est-ce que cette langue est une langue construite ?" bind:checked={ language.is_conlang } />
    <div>
        <TextInput name="iso_639_1" label="ISO 639-1" placeholder="Entrez le code ISO 639-1 de la langue." bind:value={ language.iso_639_1 } />
        <TextInput name="iso_639_3" label="ISO 639-3" placeholder="Entrez le code ISO 639-3 de la langue." bind:value={ language.iso_639_3 } />
    </div>
    <Select label="Sens de lecture de la langue" options={ DIRECTION } value={ language.direction } />
    <SubmitButton label={ submitButtonLabel } />
</form>