<script lang="ts">
    import { settings } from "@/renderer/stores/settingsStore";
    import { I_Category } from "@/shared/interfaces/I_Category";
    import {
        currentInspectorStateStore,
        resetCurrentInspectorState,
        setCurrentInspectorState
    } from "@/renderer/stores/currentInspectorStateStore";
    import { CategoryService } from "@/renderer/services/CategoryService";
    import { Pencil, X } from "@lucide/svelte";
    import { INSPECTOR_STATE_PRESETS } from "@/renderer/utils/inspectorStatePresets";
    import IconButton from "@/renderer/components/ui/interactive/IconButton.svelte";

    const dictionary_id: number = $settings!.currentDictionary;

    let category: I_Category = $state<I_Category>({id: 0, name: "", dictionary_id: dictionary_id});

    async function loadCategory() {
        let inspectorState = $currentInspectorStateStore;

        if (inspectorState.category === 'content' && inspectorState.id !== undefined) {
            const data = await CategoryService.readOne(inspectorState.id);
            if (data) Object.assign(category, data);
        } else {
            category = { id: 0, name: "", dictionary_id: dictionary_id };
        }
    }

    $effect(() => {
        loadCategory();
    });
</script>

<div class="{ category.id === 0 ? 'h-full flex flex-row justify-center items-center' : 'space-y-4'}">
    {#if category.id === 0}
        <p>La catégorie demandée n'a pas été trouvé.</p>
    {:else}
        <div>
            <div class="flex flex-row items-center relative">
                <h2 class="mx-auto">{ category.name }</h2>
                <div class="space-x-1 absolute top-0 right-0">
                    <IconButton icon={ Pencil } onClick={ () => setCurrentInspectorState(INSPECTOR_STATE_PRESETS.CONTENT.CATEGORY.UPDATE(category.id)) } />
                    <IconButton icon={ X } onClick={ () => resetCurrentInspectorState() } />
                </div>
            </div>
        </div>
    {/if}
</div>