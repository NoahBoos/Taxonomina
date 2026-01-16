<script lang="ts">
    import {settings} from '@/renderer/stores/settingsStore';
    import {I_GrammaticalGenre} from "@/shared/interfaces/I_GrammaticalGenre";
    import {GrammaticalGenreService} from "@/renderer/services/GrammaticalGenreService";
    import ContentSearchBar from "@/renderer/components/browser/ContentSearchBar.svelte";
    import ContentList from "@/renderer/components/browser/ContentList.svelte";
    import PreviousPageButton from "@/renderer/components/browser/pagination/PreviousPageButton.svelte";
    import NextPageButton from "@/renderer/components/browser/pagination/NextPageButton.svelte";
    import PaginationInformation from "@/renderer/components/browser/pagination/PaginationInformation.svelte";
    import {setCurrentInspectorState} from "@/renderer/stores/currentInspectorStateStore";
    import {INSPECTOR_STATE_PRESETS} from "@/renderer/utils/inspectorStatePresets";
    import AddContentButton from "@/renderer/components/browser/AddContentButton.svelte";

    let dictionary_id: number | undefined = $derived($settings?.currentDictionary);
    const elementsPerPage: number = $derived($settings?.elementsPerPage ?? 25);
    let currentPage: number = $state(1);

    let grammaticalGenres: I_GrammaticalGenre[] = $state([]);
    let query: string = $state('');
    let filteredGrammaticalGenres: I_GrammaticalGenre[] = $derived(grammaticalGenres.filter(genre => genre.name.toLowerCase().includes(query.toLowerCase())));

    let totalPages: number = $derived(Math.ceil(filteredGrammaticalGenres.length / elementsPerPage));
    let paginatedGrammaticalGenres: I_GrammaticalGenre[] = $derived(filteredGrammaticalGenres.slice((currentPage - 1) * elementsPerPage, currentPage * elementsPerPage));

    async function refresh() {
        if (dictionary_id) grammaticalGenres = (await GrammaticalGenreService.ReadAll(dictionary_id));
        else grammaticalGenres = [];
    }

    function openCreateForm() {
        setCurrentInspectorState(INSPECTOR_STATE_PRESETS.CONTENT.GRAMMATICAL_GENRE.CREATE);
    }

    $effect(() => { refresh(); });
</script>

<style>

</style>

<div class="flex flex-col h-full gap-4">
    <div class="flex flex-row gap-2">
        <ContentSearchBar bind:query={ query } bind:currentPage={ currentPage } />
        <AddContentButton onClick={ openCreateForm } />
    </div>
    <ContentList items={ paginatedGrammaticalGenres } />
    <div class="flex flex-row justify-between">
        <PreviousPageButton bind:currentPage={ currentPage } />
        <PaginationInformation bind:currentPage={ currentPage } totalPages={ totalPages } elementsPerPage={ elementsPerPage } />
        <NextPageButton bind:currentPage={ currentPage } bind:totalPages={ totalPages } />
    </div>
</div>