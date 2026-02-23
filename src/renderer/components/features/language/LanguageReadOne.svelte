<script lang="ts">
    import { settings } from "@/renderer/stores/settingsStore";
    import { I_Language } from "@/shared/interfaces/I_Language";
    import {
        currentInspectorStateStore,
        resetCurrentInspectorState,
        setCurrentInspectorState
    } from "@/renderer/stores/currentInspectorStateStore";
    import { LanguageService } from "@/renderer/services/LanguageService";
    import IconButton from "@/renderer/components/ui/interactive/IconButton.svelte";
    import { Pencil, X } from "@lucide/svelte";
    import { INSPECTOR_STATE_PRESETS } from "@/renderer/utils/inspectorStatePresets";

    const dictionary_id: number = $settings!.currentDictionary;

    let language: I_Language = $state<I_Language>({
        id: 0,
        dictionary_id: dictionary_id,
        name_native: '',
        name_localized: '',
        is_conlang: false,
        iso_639_1: '',
        iso_639_3: '',
        direction: 'ltr'
    });

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
                name_localized: '',
                is_conlang: false,
                iso_639_1: '',
                iso_639_3: '',
                direction: 'ltr'
            };
        }
    }

    $effect(() => {
        loadLanguage();
    });
</script>

<style>

</style>

<div class="{ language.id === 0 ? 'h-full flex flex-row justify-center items-center' : 'space-y-4'}">
    {#if language.id === 0}
        <p>La classe grammaticale demandée n'a pas été trouvé.</p>
    {:else}
        <div class="flex flex-row items-center relative">
            <h2 class="mx-auto">{ language.name_native } / { language.name_localized }</h2>
            <div class="space-x-2 absolute top-0 right-0">
                <IconButton icon={ Pencil } onClick={ () => setCurrentInspectorState(INSPECTOR_STATE_PRESETS.CONTENT.LANGUAGE.UPDATE(language.id)) } />
                <IconButton icon={ X } onClick={ () => resetCurrentInspectorState() } />
            </div>
        </div>
        <div class="space-y-4 divide-y-2 divide-base-40">
            <ul class="space-y-2 pb-4">
                <li>Code ISO 639-1 : { language.iso_639_1 }</li>
                <li>Code ISO 639-1 : { language.iso_639_3 }</li>
                {#if language.is_conlang }
                    <li>Cette langue est une langue construite.</li>
                {/if}
                <li>Sens de lecture : { language.direction === 'ltr' ? 'Gauche à droite' : language.direction === 'rtl' ? 'Droite à gauche' : 'Inconnu' }</li>
            </ul>
        </div>
    {/if}
</div>