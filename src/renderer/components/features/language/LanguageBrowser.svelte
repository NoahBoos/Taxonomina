<script lang="ts">
    import {ContentType} from "@/renderer/enums/ContentType";
    import {setContext} from "svelte";
    import {settings} from '@/renderer/stores/settingsStore';
    import {I_Language} from "@/shared/interfaces/I_Language";
    import {LanguageService} from "@/renderer/services/LanguageService";
    import ContentList from "@/renderer/components/browser/ContentList.svelte";
    import {CONTENT_TYPE_KEY} from "@/renderer/utils/symbols";

    let languages: I_Language[] = $state([]);

    const contentType: ContentType = ContentType.Language;
    setContext(CONTENT_TYPE_KEY, contentType);

    let dictionary_id = $derived($settings?.currentDictionary);

    async function refresh() {
        if (dictionary_id) {
            languages = (await LanguageService.ReadAll(dictionary_id)).map(language => ({
                id: language.GetId(),
                dictionary_id: language.GetDictionaryId(),
                iso_639_1: language.GetIso639_1(),
                iso_639_3: language.GetIso639_3(),
                is_conlang: language.GetIsConlang(),
                name_native: language.GetNameNative(),
                name_local: language.GetNameLocal(),
                direction: language.GetDirection()
            }));
            console.log(languages);
        } else {
            languages = [];
        }
    }

    $effect(() => { refresh(); });
</script>

<style>

</style>

<div>
    <ContentList items={languages} />
</div>