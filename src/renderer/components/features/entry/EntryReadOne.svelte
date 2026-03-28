<script lang="ts">
    import { I_Entry } from "@/shared/interfaces/I_Entry";
    import { settings } from "@/renderer/stores/settingsStore";
    import { currentInspectorStateStore, resetCurrentInspectorState, setCurrentInspectorState } from "@/renderer/stores/currentInspectorStateStore";
    import { EntryService } from "@/renderer/services/EntryService";
    import EntryThumbnail from "@/renderer/components/features/entry/EntryThumbnail.svelte";
    import IconButton from "@/renderer/components/ui/interactive/IconButton.svelte";
    import { Pencil, X } from "@lucide/svelte";
    import { INSPECTOR_STATE_PRESETS } from "@/renderer/utils/inspectorStatePresets";

    const dictionary_id: number = $settings!.currentDictionary;

    let entry: I_Entry = $state<I_Entry>({ id: 0, dictionary_id: dictionary_id, language_id: 0, lemma: '', definitions: [], grammatical_classes: [], grammatical_genres: [], language: undefined, translations: [] });

    async function loadEntry() {
        let inspectorState = $currentInspectorStateStore;

        if (inspectorState.category === "content" && inspectorState.id !== undefined) {
            entry = await EntryService.readOne(inspectorState.id);
        } else {
            entry = { id: 0, dictionary_id: dictionary_id, language_id: 0, lemma: '', definitions: [], grammatical_classes: [], grammatical_genres: [], language: undefined, translations: [] };
        }
    }

    $effect(() => {
        loadEntry();
    });
</script>

<style>

</style>

<div class="{ entry.id === 0 ? 'h-full flex flex-row justify-center items-center' : 'space-y-4' }">
    {#if entry.id === 0}
        <p>L'entrée demandée n'a pas été trouvé.</p>
    {:else}
        <div class="space-y-2">
            <div class="flex flex-row items-center relative">
                <h2 class="mx-auto">{ entry.lemma }</h2>
                <div class="space-x-1 absolute top-0 right-0">
                    <IconButton icon={ Pencil } onClick={ () => setCurrentInspectorState(INSPECTOR_STATE_PRESETS.CONTENT.ENTRY.UPDATE(entry.id)) } />
                    <IconButton icon={ X } onClick={ () => resetCurrentInspectorState() } />
                </div>
            </div>
        </div>
        <div class="space-y-4 divide-y-2 divide-base-40">
            {#if entry.grammatical_classes && entry.grammatical_classes.length > 0 }
                <div class="space-y-2 pb-4">
                    <h3>Classes grammaticales</h3>
                    <div class="flex flex-row flex-wrap gap-2">
                        {#each entry.grammatical_classes as grammatical_class}
                            {#key grammatical_class.id}
                                <p class="w-fit h-fit px-2 bg-base-50 rounded-lg">{ grammatical_class.name }</p>
                            {/key}
                        {/each}
                    </div>
                </div>
            {/if}
            {#if entry.grammatical_genres && entry.grammatical_genres.length > 0 }
                <div class="space-y-2 pb-4">
                    <h3>Genres grammaticaux</h3>
                    <div class="flex flex-row flex-wrap gap-2">
                        {#each entry.grammatical_genres as grammatical_genre}
                            {#key grammatical_genre.id}
                                <p class="w-fit h-fit px-2 bg-base-50 rounded-lg">{ grammatical_genre.name }</p>
                            {/key}
                        {/each}
                    </div>
                </div>
            {/if}
            {#if entry.definitions && entry.definitions.length > 0 }
                <div class="space-y-2 pb-4">
                    <h3>Définitions</h3>
                    {#each entry.definitions as definition, index}
                        {#key definition.id}
                            <div class="space-y-1">
                                {#if definition.categories === undefined || definition.categories.length > 0}
                                    <div class="flex flex-row items-center gap-2">
                                        <p>{ index + 1 }.</p>
                                        <div class="flex flex-row flex-wrap gap-2">
                                            {#each definition.categories as category}
                                                {#key category.id}
                                                    <p class="w-fit h-fit text-sm px-2 bg-base-50 rounded-lg">{ category.name }</p>
                                                {/key}
                                            {/each}
                                        </div>
                                    </div>
                                    <p>{ definition.definition }</p>
                                {:else}
                                    <div class="flex flex-row items-center gap-2">
                                        <p>{ index + 1 }.</p>
                                        <p>{ definition.definition }</p>
                                    </div>
                                {/if}
                            </div>
                        {/key}
                    {/each}
                </div>
            {/if}
            {#if entry.translations && entry.translations.length > 0 }
                <div class="space-y-2 pb-4">
                    <h3>Traductions</h3>
                    <div class="grid grid-cols-3 gap-2">
                        {#each entry.translations as translation}
                            {#key translation.id}
                                <EntryThumbnail item={ translation } variant="inspector" />
                            {/key}
                        {/each}
                    </div>
                </div>
            {/if}
        </div>
    {/if}
</div>