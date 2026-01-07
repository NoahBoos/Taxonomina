<script lang="ts">
    import {ContentType} from "@/renderer/enums/ContentType";
    import {setContext} from "svelte";
    import {settings} from '@/renderer/stores/settingsStore';
    import {I_Language} from "@/shared/interfaces/I_Language";
    import {LanguageService} from "@/renderer/services/LanguageService";
    import ContentList from "@/renderer/components/browser/ContentList.svelte";
    import {CONTENT_TYPE_KEY} from "@/renderer/utils/symbols";
    import ContentSearchBar from "@/renderer/components/browser/ContentSearchBar.svelte";
    import PreviousPageButton from "@/renderer/components/browser/pagination/PreviousPageButton.svelte";
    import PaginationInformation from "@/renderer/components/browser/pagination/PaginationInformation.svelte";
    import NextPageButton from "@/renderer/components/browser/pagination/NextPageButton.svelte";

    const contentType: ContentType = ContentType.Language;
    setContext(CONTENT_TYPE_KEY, contentType);

    let dictionary_id: number | undefined = $derived($settings?.currentDictionary);
    const elementsPerPage: number = $derived($settings?.elementsPerPage ?? 25);
    let currentPage: number = $state(1);

    let languages: I_Language[] = $state([]);
    let query: string = $state('');
    let filteredLanguages: I_Language[] = $derived(
        languages.filter(language =>
            language.iso_639_1.toLowerCase().includes(query.toLowerCase())
            || language.iso_639_3.toLowerCase().includes(query.toLowerCase())
            || language.name_native.toLowerCase().includes(query.toLowerCase())
            || language.name_local.toLowerCase().includes(query.toLowerCase())
        )
    );

    let totalPages: number = $derived(Math.ceil(filteredLanguages.length / elementsPerPage));
    let paginatedLanguages: I_Language[] = $derived(filteredLanguages.slice((currentPage - 1) * elementsPerPage, currentPage * elementsPerPage));

    async function refresh() {
        if (dictionary_id) languages = (await LanguageService.ReadAll(dictionary_id)).map(language => language.ToJSON());
        else languages = [];
    }

    $effect(() => { refresh(); });
</script>

<style>

</style>

<div>
    <div>
        <ContentSearchBar bind:query={ query } bind:currentPage={ currentPage } />
    </div>
    <ContentList items={ paginatedLanguages } />
    <div>
        <PreviousPageButton bind:currentPage={ currentPage } />
        <PaginationInformation bind:currentPage={ currentPage } totalPages={ totalPages } elementsPerPage={ elementsPerPage } />
        <NextPageButton bind:currentPage={ currentPage } bind:totalPages={ totalPages } />
    </div>
</div>