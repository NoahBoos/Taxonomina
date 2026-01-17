<script lang="ts">
    import {setCurrentInspectorState} from "@/renderer/stores/currentInspectorStateStore";
    import {settings} from '@/renderer/stores/settingsStore';
    import {I_Language} from "@/shared/interfaces/I_Language";
    import {LanguageService} from "@/renderer/services/LanguageService";
    import ContentList from "@/renderer/components/browser/ContentList.svelte";
    import ContentSearchBar from "@/renderer/components/browser/ContentSearchBar.svelte";
    import PreviousPageButton from "@/renderer/components/browser/pagination/PreviousPageButton.svelte";
    import PaginationInformation from "@/renderer/components/browser/pagination/PaginationInformation.svelte";
    import NextPageButton from "@/renderer/components/browser/pagination/NextPageButton.svelte";
    import AddContentButton from "@/renderer/components/browser/AddContentButton.svelte";
    import {INSPECTOR_STATE_PRESETS} from "@/renderer/utils/inspectorStatePresets";

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
        if (dictionary_id) languages = (await LanguageService.ReadAll(dictionary_id));
        else languages = [];
    }

    function openCreateForm() {
        setCurrentInspectorState(INSPECTOR_STATE_PRESETS.CONTENT.LANGUAGE.CREATE);
    }

    $effect(() => { refresh(); });
</script>

<style>

</style>

<div class="flex flex-col h-full gap-4">
    <div class="space-y-2">
        <h2>Langues</h2>
        <div class="flex flex-row gap-2">
            <ContentSearchBar bind:query={ query } bind:currentPage={ currentPage } />
            <AddContentButton onClick={ openCreateForm } />
        </div>
    </div>
    <ContentList items={ paginatedLanguages } />
    <div class="flex flex-row justify-between items-center">
        <PreviousPageButton bind:currentPage={ currentPage } />
        <PaginationInformation bind:currentPage={ currentPage } totalPages={ totalPages } elementsPerPage={ elementsPerPage } />
        <NextPageButton bind:currentPage={ currentPage } bind:totalPages={ totalPages } />
    </div>
</div>