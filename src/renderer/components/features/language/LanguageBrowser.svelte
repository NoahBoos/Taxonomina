<script lang="ts">
    import {ContentType} from "@/renderer/enums/ContentType";
    import {setContext} from "svelte";
    import {settings} from '@/renderer/stores/settingsStore';
    import {I_Language} from "@/shared/interfaces/I_Language";
    import {LanguageService} from "@/renderer/services/LanguageService";
    import ContentList from "@/renderer/components/browser/ContentList.svelte";
    import {CONTENT_TYPE_KEY} from "@/renderer/utils/symbols";
    import ContentSearchBar from "@/renderer/components/browser/ContentSearchBar.svelte";

    const contentType: ContentType = ContentType.Language;
    setContext(CONTENT_TYPE_KEY, contentType);

    let languages: I_Language[] = $state([]);
    let query = $state('');
    let filteredLanguages: I_Language[] = $derived(
        languages.filter(language =>
            language.iso_639_1.toLowerCase().includes(query.toLowerCase())
            || language.iso_639_3.toLowerCase().includes(query.toLowerCase())
            || language.name_native.toLowerCase().includes(query.toLowerCase())
            || language.name_local.toLowerCase().includes(query.toLowerCase())
        )
    );

    let dictionary_id = $derived($settings?.currentDictionary);

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
        <ContentSearchBar bind:query={ query } />
    </div>
    <ContentList items={ filteredLanguages } />
</div>