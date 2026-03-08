<script lang="ts">
    import { settings } from "@/renderer/stores/settingsStore";
    import { setCurrentInspectorState } from "@/renderer/stores/currentInspectorStateStore";
    import { INSPECTOR_STATE_PRESETS } from "@/renderer/utils/inspectorStatePresets";
    import { ContentType } from "@/renderer/enums/ContentType";
    import PaginationInformation from "@/renderer/components/browser/pagination/PaginationInformation.svelte";
    import ContentList from "@/renderer/components/browser/ContentList.svelte";
    import AddContentButton from "@/renderer/components/browser/AddContentButton.svelte";
    import NextPageButton from "@/renderer/components/browser/pagination/NextPageButton.svelte";
    import PreviousPageButton from "@/renderer/components/browser/pagination/PreviousPageButton.svelte";
    import ContentSearchBar from "@/renderer/components/browser/ContentSearchBar.svelte";
    import { categoriesStore, refreshCategories } from "@/renderer/stores/categoriesStore";
    import { I_Category } from "@/shared/interfaces/I_Category";

    const elementsPerPage: number = $derived($settings?.elementsPerPage ?? 25);
    let currentPage: number = $state(1);

    let query: string = $state('');
    let filteredCategories: I_Category[] = $derived($categoriesStore.filter(category => category.name.toLowerCase().includes(query.toLowerCase())));

    let totalPages: number = $derived(Math.ceil(filteredCategories.length / elementsPerPage));
    let paginatedCategories: I_Category[] = $derived(filteredCategories.slice((currentPage - 1) * elementsPerPage, currentPage * elementsPerPage));

    async function refresh() {
        await refreshCategories();
    }

    function openCreateForm() {
        setCurrentInspectorState(INSPECTOR_STATE_PRESETS.CONTENT.CATEGORY.CREATE);
    }

    $effect(() => { refresh(); });
</script>

<div class="flex flex-col h-full gap-4">
    <div class="space-y-2">
        <h2>Classes grammaticales</h2>
        <div class="flex flex-row items-center gap-2">
            <ContentSearchBar bind:query={ query } bind:currentPage={ currentPage } />
            <AddContentButton onClick={ openCreateForm } contentType={ ContentType.Category } />
        </div>
    </div>
    <ContentList items={ paginatedCategories } />
    <div class="flex flex-row justify-between items-center">
        <PreviousPageButton bind:currentPage={ currentPage } />
        <PaginationInformation bind:currentPage={ currentPage } totalPages={ totalPages } elementsPerPage={ elementsPerPage } />
        <NextPageButton bind:currentPage={ currentPage } bind:totalPages={ totalPages } />
    </div>
</div>