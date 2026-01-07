<script lang="ts">
    import {ContentType} from "@/renderer/enums/ContentType";
    import {setContext} from "svelte";
    import {settings} from '@/renderer/stores/settingsStore';
    import {CONTENT_TYPE_KEY} from "@/renderer/utils/symbols";
    import {I_Entry} from "@/shared/interfaces/I_Entry";
    import {EntryService} from "@/renderer/services/EntryService";
    import PreviousPageButton from "@/renderer/components/browser/pagination/PreviousPageButton.svelte";
    import ContentList from "@/renderer/components/browser/ContentList.svelte";
    import NextPageButton from "@/renderer/components/browser/pagination/NextPageButton.svelte";
    import ContentSearchBar from "@/renderer/components/browser/ContentSearchBar.svelte";
    import PaginationInformation from "@/renderer/components/browser/pagination/PaginationInformation.svelte";

    const contentType: ContentType = ContentType.Entry;
    setContext(CONTENT_TYPE_KEY, contentType);

    let dictionary_id = $derived($settings?.currentDictionary);
    const elementsPerPage = $derived($settings?.elementsPerPage ?? 25);
    let currentPage = $state(1);

    let entries: I_Entry[] = $state([]);
    let query = $state('');
    let filteredEntries: I_Entry[] = $derived(entries.filter(entry => entry.lemma.toLowerCase().includes(query.toLowerCase())));

    let totalPages = $derived(Math.ceil(filteredEntries.length / elementsPerPage));
    let paginatedEntries = $derived(filteredEntries.slice((currentPage - 1) * elementsPerPage, currentPage * elementsPerPage));

    async function refresh() {
        if (dictionary_id) entries = (await EntryService.ReadAll(dictionary_id)).map(entry => entry.ToJSON());
        else entries = [];
    }

    $effect(() => { refresh(); });
</script>

<style>

</style>

<div>
    <div>
        <ContentSearchBar bind:query={ query } bind:currentPage={ currentPage } />
    </div>
    <ContentList items={ paginatedEntries } />
    <div>
        <PreviousPageButton bind:currentPage={ currentPage } />
        <PaginationInformation bind:currentPage={ currentPage } totalPages={ totalPages } elementsPerPage={ elementsPerPage } />
        <NextPageButton bind:currentPage={ currentPage } bind:totalPages={ totalPages } />
    </div>
</div>