<script lang="ts">
    import {ContentType} from "@/renderer/enums/ContentType";
    import {setContext} from "svelte";
    import {settings} from '@/renderer/stores/settingsStore';
    import {CONTENT_TYPE_KEY} from "@/renderer/utils/symbols";
    import {I_GrammaticalClass} from "@/shared/interfaces/I_GrammaticalClass";
    import {GrammaticalClassService} from "@/renderer/services/GrammaticalClassService";
    import PreviousPageButton from "@/renderer/components/browser/pagination/PreviousPageButton.svelte";
    import ContentList from "@/renderer/components/browser/ContentList.svelte";
    import NextPageButton from "@/renderer/components/browser/pagination/NextPageButton.svelte";
    import ContentSearchBar from "@/renderer/components/browser/ContentSearchBar.svelte";
    import PaginationInformation from "@/renderer/components/browser/pagination/PaginationInformation.svelte";

    const contentType: ContentType = ContentType.GrammaticalClass;
    setContext(CONTENT_TYPE_KEY, contentType);

    let dictionary_id: number | undefined = $derived($settings?.currentDictionary);
    const elementsPerPage: number = $derived($settings?.elementsPerPage ?? 25);
    let currentPage: number = $state(1);

    let grammaticalClasses: I_GrammaticalClass[] = $state([]);
    let query: string = $state('');
    let filteredGrammaticalClasses: I_GrammaticalClass[] = $derived(grammaticalClasses.filter(gc => gc.name.toLowerCase().includes(query.toLowerCase())));

    let totalPages: number = $derived(Math.ceil(filteredGrammaticalClasses.length / elementsPerPage));
    let paginatedGrammaticalClasses: I_GrammaticalClass[] = $derived(filteredGrammaticalClasses.slice((currentPage - 1) * elementsPerPage, currentPage * elementsPerPage));

    async function refresh() {
        if (dictionary_id) grammaticalClasses = (await GrammaticalClassService.ReadAll(dictionary_id)).map(gc => gc.ToJSON());
        else grammaticalClasses = [];
    }

    $effect(() => { refresh(); });
</script>

<style>

</style>

<div>
    <div>
        <ContentSearchBar bind:query={ query } bind:currentPage={ currentPage } />
    </div>
    <ContentList items={ paginatedGrammaticalClasses } />
    <div>
        <PreviousPageButton bind:currentPage={ currentPage } />
        <PaginationInformation bind:currentPage={ currentPage } totalPages={ totalPages } elementsPerPage={ elementsPerPage } />
        <NextPageButton bind:currentPage={ currentPage } bind:totalPages={ totalPages } />
    </div>
</div>