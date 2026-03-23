<script lang="ts">
    import { I_Definition } from "@/shared/interfaces/I_Definition";
    import { definitionFormErrorsStore } from "@/renderer/stores/definitionFormErrorsStore";
    import { ErrorDomain, TaxonominaError } from "@/shared/errors/types";
    import IconButton from "@/renderer/components/ui/interactive/IconButton.svelte";
    import { Minus } from "@lucide/svelte";
    import Tag from "@/renderer/components/ui/display/Tag.svelte";
    import { I_Category } from "@/shared/interfaces/I_Category";
    import { CategoryService } from "@/renderer/services/CategoryService";
    import { settings } from "@/renderer/stores/settingsStore";
    import Searchbar from "@/renderer/components/ui/forms/Searchbar.svelte";
    import FloatingList from "@/renderer/components/ui/display/FloatingList.svelte";
    import FloatingListItem from "@/renderer/components/ui/interactive/FloatingListItem.svelte";

    interface Props {
        label: string;
        definition: I_Definition;
        onRemove: () => void;
    }

    let { label, definition = $bindable(), onRemove }: Props = $props();
    let query = $state('');
    let category_suggestions = $state<I_Category[]>([]);
    let is_searchbar_focused = $state(false);
    let is_searching = $state(false);
    let show_dropdown = $derived(is_searchbar_focused && query.length > 0 && category_suggestions.length > 0);

    let errors: TaxonominaError<ErrorDomain>[] = $definitionFormErrorsStore.filter(e => e.target.type === 'form_field' && e.target.field_name === definition.clientKey);

    function addCategory(category: I_Category) {
        if (definition.categories === undefined) definition.categories = [];
        if (!definition.categories?.some(c => c.id === category.id)) definition.categories?.push(category);
        query = '';
        category_suggestions = [];
    }

    function removeCategory(category: I_Category) {
        definition.categories = definition.categories?.filter(c => c.id !== category.id);
    }

    $effect(() => {
        const _query = query;
        const timer = setTimeout(async () => {
            if (_query.trim().length > 1) {
                is_searching = true;

                category_suggestions = (await CategoryService.readAll($settings!.currentDictionary)).filter(c => {
                    return c.name.toLowerCase().includes(_query.toLowerCase())
                        && !definition.categories?.some(d => d.id === c.id);
                }).sort((a, b) => a.name.localeCompare(b.name)).slice(0, 5);

                is_searching = false;
            } else {
                category_suggestions = [];
            }
        }, 200);

        return () => clearTimeout(timer);
    });
</script>

<style>

</style>

<div class="w-full flex flex-col gap-2 p-4 rounded-lg bg-base-20 { errors.length > 0 ? 'border-2 border-red-600 bg-red-400/15' : '' }">
    <div class="flex flex-row justify-between items-center">
        <p class="text-lg font-bold">{ label }</p>
        <IconButton icon={ Minus } onClick={ onRemove } />
    </div>
    <div class="flex flex-col gap-2">
        <label for={ definition.clientKey + '-definition' }>Définition</label>
        <input type="text" id={ definition.clientKey + '-definition' } name={ definition.clientKey + '-definition' } placeholder="Entrez votre définition." bind:value={ definition.definition } class="w-full px-2 py-1 border-2 rounded-lg border-base-40 hover:border-accent-500 bg-base-10 hover:bg-base-20 transition-colors duration-250 ease-out" />
    </div>
    <div class="space-y-2">
        <div>
            <div class="flex flex-col gap-2">
                <p class="font-bold">Catégories</p>
                <Searchbar placeholder="Rechercher une catégorie..." bind:query onfocus={ () => is_searchbar_focused = true } onblur={ () => setTimeout(() =>is_searchbar_focused = false, 150) } />
            </div>
            <FloatingList visible={ show_dropdown }>
                {#each category_suggestions as category}
                    <FloatingListItem label={ category.name } onClick={ () => addCategory(category) } />
                {/each}
            </FloatingList>
        </div>
        {#if definition.categories === undefined || definition.categories?.length === 0 }
            <p>Aucune catégorie n'a été reliée à cette définition.</p>
            <p>Commencez une recherche dans la barre de recherche dédiée plus-haut pour ajouter une première catégorie.</p>
        {:else}
            <div class="flex flex-row flex-wrap gap-2">
                {#each definition.categories as category}
                    <Tag label={ category.name } onRemove={ () => removeCategory(category) } />
                {/each}
            </div>
        {/if}
    </div>
    {#if errors.length > 0}
        <div>
            {#each errors as error}
                <p>{ error.code } : { error.message }</p>
            {/each}
        </div>
    {/if}
</div>