<script lang="ts">
    import { settings } from "@/renderer/stores/settingsStore";
    import { I_GrammaticalGenre } from "@/shared/interfaces/I_GrammaticalGenre";
    import {
        currentInspectorStateStore,
        resetCurrentInspectorState,
        setCurrentInspectorState
    } from "@/renderer/stores/currentInspectorStateStore";
    import { GrammaticalGenreService } from "@/renderer/services/GrammaticalGenreService";
    import IconButton from "@/renderer/components/ui/interactive/IconButton.svelte";
    import { Pencil, X } from "@lucide/svelte";
    import { INSPECTOR_STATE_PRESETS } from "@/renderer/utils/inspectorStatePresets";

    const dictionary_id: number = $settings!.currentDictionary;

    let grammatical_genre: I_GrammaticalGenre = $state<I_GrammaticalGenre>({ id: 0, dictionary_id: dictionary_id, name: ''});

    async function loadGrammaticalGenre() {
        let inspectorState = $currentInspectorStateStore;

        if (inspectorState.category === "content" && inspectorState.id !== undefined) {
            const data = await GrammaticalGenreService.readOne(inspectorState.id);
            if (data) Object.assign(grammatical_genre, data);
        } else {
            grammatical_genre = { id: 0, dictionary_id: dictionary_id, name: ''};
        }
    }

    $effect(() => {
        loadGrammaticalGenre();
    });
</script>

<style>

</style>

<div class="{ grammatical_genre.id === 0 ? 'h-full flex flex-row justify-center items-center' : 'space-y-4'}">
    {#if grammatical_genre.id === 0}
        <p>Le genre grammatical demandé n'a pas été trouvé.</p>
    {:else}
        <div class="flex flex-row items-center relative">
            <h2 class="mx-auto">{ grammatical_genre.name }</h2>
            <div class="space-x-2 absolute top-0 right-0">
                <IconButton icon={ Pencil } onClick={ () => setCurrentInspectorState(INSPECTOR_STATE_PRESETS.CONTENT.GRAMMATICAL_GENRE.UPDATE(grammatical_genre.id)) } />
                <IconButton icon={ X } onClick={ () => resetCurrentInspectorState() } />
            </div>
        </div>
    {/if}
</div>