<script lang="ts">
    import {ContentType} from "@/renderer/enums/ContentType";
    import {setContext} from "svelte";
    import {settings} from '@/renderer/stores/settingsStore';
    import {CONTENT_TYPE_KEY} from "@/renderer/utils/symbols";
    import {I_GrammaticalGenre} from "@/shared/interfaces/I_GrammaticalGenre";
    import {GrammaticalGenreService} from "@/renderer/services/GrammaticalGenreService";
    import ContentSearchBar from "@/renderer/components/browser/ContentSearchBar.svelte";
    import ContentList from "@/renderer/components/browser/ContentList.svelte";
    import PreviousPageButton from "@/renderer/components/browser/pagination/PreviousPageButton.svelte";
    import NextPageButton from "@/renderer/components/browser/pagination/NextPageButton.svelte";
    import PaginationInformation from "@/renderer/components/browser/pagination/PaginationInformation.svelte";

    const contentType: ContentType = ContentType.GrammaticalGenre;
    setContext(CONTENT_TYPE_KEY, contentType);

    let dictionary_id: number | undefined = $derived($settings?.currentDictionary);
    const elementsPerPage: number = $derived($settings?.elementsPerPage ?? 25);
    let currentPage: number = $state(1);

    let grammaticalGenres: I_GrammaticalGenre[] = $state([]);
    let query: string = $state('');
    let filteredGrammaticalGenres: I_GrammaticalGenre[] = $derived(grammaticalGenres.filter(genre => genre.name.toLowerCase().includes(query.toLowerCase())));

    let totalPages: number = $derived(Math.ceil(filteredGrammaticalGenres.length / elementsPerPage));
    let paginatedGrammaticalGenres: I_GrammaticalGenre[] = $derived(filteredGrammaticalGenres.slice((currentPage - 1) * elementsPerPage, currentPage * elementsPerPage));

    async function refresh() {
        if (dictionary_id) grammaticalGenres = (await GrammaticalGenreService.ReadAll(dictionary_id)).map(gg => gg.ToJSON());
        else grammaticalGenres = [];
    }

    $effect(() => { refresh(); });
</script>

<style>

</style>

<div>
    <div>
        <ContentSearchBar bind:query={ query } bind:currentPage={ currentPage } />
    </div>
    <ContentList items={ paginatedGrammaticalGenres } />
    <div>
        <PreviousPageButton bind:currentPage={ currentPage } />
        <PaginationInformation bind:currentPage={ currentPage } totalPages={ totalPages } elementsPerPage={ elementsPerPage } />
        <NextPageButton bind:currentPage={ currentPage } bind:totalPages={ totalPages } />
    </div>
</div>