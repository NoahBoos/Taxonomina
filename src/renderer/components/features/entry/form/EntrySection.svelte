<script lang="ts">
    import {I_Entry} from "@/shared/interfaces/I_Entry";
    import TextInput from "@/renderer/components/ui/forms/TextInput.svelte";
    import Select from "@/renderer/components/ui/forms/Select.svelte";
    import {SelectOptions} from "@/renderer/types/SelectOptions";
    import {LANGUAGES} from "@/renderer/utils/selectOptionPresets";

    let { dictionary_id, entry = $bindable() }: { dictionary_id: number, entry: I_Entry } = $props();
    let languageOptions = $state<SelectOptions>({});

    $effect(() => { LANGUAGES(dictionary_id).then(options => languageOptions = options); })
</script>

<style>

</style>

<div>
    <TextInput name="lemma" label="Lemme" placeholder="Chien, chat, pigeon..." bind:value={ entry.lemma } />
    <Select label="Langue" options={ languageOptions } bind:value={ entry.language_id } />
</div>