<script lang="ts">
    import {settings} from '@/renderer/stores/settingsStore';
    import {I_Entry} from "@/shared/interfaces/I_Entry";
    import PreviousPageButton from "@/renderer/components/browser/pagination/PreviousPageButton.svelte";
    import ContentList from "@/renderer/components/browser/ContentList.svelte";
    import NextPageButton from "@/renderer/components/browser/pagination/NextPageButton.svelte";
    import ContentSearchBar from "@/renderer/components/browser/ContentSearchBar.svelte";
    import PaginationInformation from "@/renderer/components/browser/pagination/PaginationInformation.svelte";
    import {setCurrentInspectorState} from "@/renderer/stores/currentInspectorStateStore";
    import {INSPECTOR_STATE_PRESETS} from "@/renderer/utils/inspectorStatePresets";
    import AddContentButton from "@/renderer/components/browser/AddContentButton.svelte";
    import { entriesStore, refreshEntries } from "@/renderer/stores/entriesStore";
    import { ContentType } from "@/renderer/enums/ContentType";

    const elementsPerPage: number = $derived($settings?.elementsPerPage ?? 25);
    let currentPage: number = $state(1);

    let query: string = $state('');
    let filteredEntries: I_Entry[] = $derived($entriesStore.filter(entry => entry.lemma.toLowerCase().includes(query.toLowerCase())));

    let totalPages: number = $derived(Math.ceil(filteredEntries.length / elementsPerPage));
    let paginatedEntries: I_Entry[] = $derived(filteredEntries.slice((currentPage - 1) * elementsPerPage, currentPage * elementsPerPage));

    async function refresh() {
        await refreshEntries();
    }

    function openCreateForm() {
        setCurrentInspectorState(INSPECTOR_STATE_PRESETS.CONTENT.ENTRY.CREATE);
    }

    $effect(() => { refresh(); });
</script>

<style>

</style>

<div class="flex flex-col h-full gap-4">
    <div class="space-y-2">
        <h2>Entrées</h2>
        <div class="flex flex-row items-center gap-2">
            <ContentSearchBar bind:query={ query } bind:currentPage={ currentPage } />
            <AddContentButton onClick={ openCreateForm } contentType={ ContentType.Entry } />
        </div>
    </div>
    <ContentList items={ paginatedEntries } />
    <div class="flex flex-row justify-between items-center">
        <PreviousPageButton bind:currentPage={ currentPage } />
        <PaginationInformation bind:currentPage={ currentPage } totalPages={ totalPages } elementsPerPage={ elementsPerPage } />
        <NextPageButton bind:currentPage={ currentPage } bind:totalPages={ totalPages } />
    </div>
</div>