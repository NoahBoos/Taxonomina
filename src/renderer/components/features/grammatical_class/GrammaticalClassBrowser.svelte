<script lang="ts">
    import {settings} from '@/renderer/stores/settingsStore';
    import {I_GrammaticalClass} from "@/shared/interfaces/I_GrammaticalClass";
    import {GrammaticalClassService} from "@/renderer/services/GrammaticalClassService";
    import PreviousPageButton from "@/renderer/components/browser/pagination/PreviousPageButton.svelte";
    import ContentList from "@/renderer/components/browser/ContentList.svelte";
    import NextPageButton from "@/renderer/components/browser/pagination/NextPageButton.svelte";
    import ContentSearchBar from "@/renderer/components/browser/ContentSearchBar.svelte";
    import PaginationInformation from "@/renderer/components/browser/pagination/PaginationInformation.svelte";
    import AddContentButton from "@/renderer/components/browser/AddContentButton.svelte";
    import {setCurrentInspectorState} from "@/renderer/stores/currentInspectorStateStore";
    import {INSPECTOR_STATE_PRESETS} from "@/renderer/utils/inspectorStatePresets";

    let dictionary_id: number | undefined = $derived($settings?.currentDictionary);
    const elementsPerPage: number = $derived($settings?.elementsPerPage ?? 25);
    let currentPage: number = $state(1);

    let grammaticalClasses: I_GrammaticalClass[] = $state([]);
    let query: string = $state('');
    let filteredGrammaticalClasses: I_GrammaticalClass[] = $derived(grammaticalClasses.filter(gc => gc.name.toLowerCase().includes(query.toLowerCase())));

    let totalPages: number = $derived(Math.ceil(filteredGrammaticalClasses.length / elementsPerPage));
    let paginatedGrammaticalClasses: I_GrammaticalClass[] = $derived(filteredGrammaticalClasses.slice((currentPage - 1) * elementsPerPage, currentPage * elementsPerPage));

    async function refresh() {
        if (dictionary_id) grammaticalClasses = (await GrammaticalClassService.readAll(dictionary_id));
        else grammaticalClasses = [];
    }

    function openCreateForm() {
        setCurrentInspectorState(INSPECTOR_STATE_PRESETS.CONTENT.GRAMMATICAL_CLASS.CREATE);
    }

    $effect(() => { refresh(); });
</script>

<style>

</style>

<div class="flex flex-col h-full gap-4">
    <div class="space-y-2">
        <h2>Classes grammaticales</h2>
        <div class="flex flex-row items-center gap-2">
            <ContentSearchBar bind:query={ query } bind:currentPage={ currentPage } />
            <AddContentButton onClick={ openCreateForm } />
        </div>
    </div>
    <ContentList items={ paginatedGrammaticalClasses } />
    <div class="flex flex-row justify-between items-center">
        <PreviousPageButton bind:currentPage={ currentPage } />
        <PaginationInformation bind:currentPage={ currentPage } totalPages={ totalPages } elementsPerPage={ elementsPerPage } />
        <NextPageButton bind:currentPage={ currentPage } bind:totalPages={ totalPages } />
    </div>
</div>