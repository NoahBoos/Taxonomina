<script lang="ts">
    import { settings } from "@/renderer/stores/settingsStore";
    import { I_GrammaticalClass } from "@/shared/interfaces/I_GrammaticalClass";
    import {
        currentInspectorStateStore,
        resetCurrentInspectorState,
        setCurrentInspectorState
    } from "@/renderer/stores/currentInspectorStateStore";
    import { GrammaticalClassService } from "@/renderer/services/GrammaticalClassService";
    import IconButton from "@/renderer/components/ui/interactive/IconButton.svelte";
    import { Pencil, X } from "@lucide/svelte";
    import { INSPECTOR_STATE_PRESETS } from "@/renderer/utils/inspectorStatePresets";

    const dictionary_id: number = $settings!.currentDictionary;

    let grammatical_class: I_GrammaticalClass = $state<I_GrammaticalClass>({ id: 0, dictionary_id: dictionary_id, name: ''});

    async function loadGrammaticalClass() {
        let inspectorState = $currentInspectorStateStore;

        if (inspectorState.category === "content" && inspectorState.id !== undefined) {
            const data = await GrammaticalClassService.readOne(inspectorState.id);
            if (data) Object.assign(grammatical_class, data);
        } else {
            grammatical_class = { id: 0, dictionary_id: dictionary_id, name: ''};
        }
    }

    $effect(() => {
        loadGrammaticalClass();
    });
</script>

<style>

</style>

<div class="{ grammatical_class.id === 0 ? 'h-full flex flex-row justify-center items-center' : 'space-y-4'}">
    {#if grammatical_class.id === 0}
        <p>La classe grammaticale demandée n'a pas été trouvé.</p>
    {:else}
        <div class="flex flex-row items-center relative">
            <h2 class="mx-auto">{ grammatical_class.name }</h2>
            <div class="space-x-2 absolute top-0 right-0">
                <IconButton icon={ Pencil } onClick={ () => setCurrentInspectorState(INSPECTOR_STATE_PRESETS.CONTENT.GRAMMATICAL_CLASS.UPDATE(grammatical_class.id)) } />
                <IconButton icon={ X } onClick={ () => resetCurrentInspectorState() } />
            </div>
        </div>
    {/if}
</div>