<script lang="ts">
    import {I_Entry} from "@/shared/interfaces/I_Entry";
    import TextInput from "@/renderer/components/ui/forms/TextInput.svelte";
    import Select from "@/renderer/components/ui/forms/Select.svelte";
    import {SelectOptions} from "@/renderer/types/SelectOptions";
    import {LANGUAGES} from "@/renderer/utils/selectOptionPresets";
    import {BookOpen} from "@lucide/svelte";
    import { entryFormErrorsStore } from "@/renderer/stores/entryFormErrorsStore";

    let { dictionary_id, entry = $bindable() }: { dictionary_id: number, entry: I_Entry } = $props();
    let languageOptions = $state<SelectOptions>({});

    let lemma_errors = $derived($entryFormErrorsStore.filter((e) => e.target.type === 'form_field' && e.target.field_name === 'lemma'));
    let language_id_errors = $derived($entryFormErrorsStore.filter((e) => e.target.type === 'form_field' && e.target.field_name === 'language_id'));

    $effect(() => { LANGUAGES(dictionary_id).then(options => languageOptions = options); })
</script>

<style>

</style>

<div class="flex flex-col gap-2">
    <div class="flex flex-row items-center gap-2">
        <BookOpen />
        <h3>Informations de base</h3>
    </div>
    <div class="flex flex-row gap-2">
        <TextInput name="lemma" label="Lemme" placeholder="Chien, chat, pigeon..." bind:value={ entry.lemma } errors={ lemma_errors } />
        <Select label="Langue" options={ languageOptions } bind:value={ entry.language_id } errors={ language_id_errors } />
    </div>
</div>
