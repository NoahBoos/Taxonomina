<script lang="ts">
    import {I_GrammaticalClass} from "@/shared/interfaces/I_GrammaticalClass";
    import {GrammaticalClassService} from "@/renderer/services/GrammaticalClassService";
    import Checkbox from "@/renderer/components/ui/forms/Checkbox.svelte";

    interface Props {
        dictionary_id: number;
        selected_grammatical_classes: I_GrammaticalClass[];
    }

    let { dictionary_id, selected_grammatical_classes = $bindable([]) }: Props = $props();

    let available_classes = $state<I_GrammaticalClass[]>([]);

    $effect(() => {
        GrammaticalClassService.readAll(dictionary_id).then(data => {
            available_classes = data.sort((a, b) => a.name.localeCompare(b.name));
        });
    });

    function toggle(target: I_GrammaticalClass) {
        const isAlreadySelected = selected_grammatical_classes.some(item => item.id === target.id);

        if (isAlreadySelected) {
            selected_grammatical_classes = selected_grammatical_classes.filter(item => item.id !== target.id);
        } else {
            selected_grammatical_classes.push(target);
        }
    }

    function isChecked(target: I_GrammaticalClass) {
        return selected_grammatical_classes.some(item => item.id === target.id);
    }
</script>

<style>

</style>

<div class="form-field-container space-y-2">
    <p class="font-bold">Classes grammaticales</p>
    {#if available_classes.length > 0}
        <div class="grid grid-cols-4 gap-1">
            {#each available_classes as grammatical_class}
                <Checkbox name={ 'gc-' + grammatical_class.id } label={ grammatical_class.name } checked={ isChecked(grammatical_class) } onChange={ () => toggle(grammatical_class) } variant="minimal" />
            {/each}
        </div>
    {:else}
        <p>Aucune classe grammaticale n'a pu être récupérée.</p>
    {/if}
</div>