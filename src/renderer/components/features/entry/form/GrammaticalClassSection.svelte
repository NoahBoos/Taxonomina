<script lang="ts">
    import {I_GrammaticalClass} from "@/shared/interfaces/I_GrammaticalClass";
    import {GrammaticalClassService} from "@/renderer/services/GrammaticalClassService";
    import Checkbox from "@/renderer/components/ui/forms/Checkbox.svelte";
    import { lockedFieldValuesStore } from "@/renderer/stores/lockedFieldValuesStore";
    import IconButton from "@/renderer/components/ui/interactive/IconButton.svelte";
    import { LockOpen, Lock } from "@lucide/svelte";

    interface Props {
        dictionary_id: number;
        selected_grammatical_classes: I_GrammaticalClass[];
        is_lockable?: boolean;
    }

    let { dictionary_id, selected_grammatical_classes = $bindable([]), is_lockable = false }: Props = $props();

    let available_classes = $state<I_GrammaticalClass[]>([]);

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

    let is_locked = $state(false);

    function toggleLock() {
        if (is_locked) {
            lockedFieldValuesStore.update((current) => {
                const { ['grammatical-classes']: _removed, ...rest } = current;
                return rest;
            });
            is_locked = false;
        } else {
            if (selected_grammatical_classes.length === 0) return;
            const snapshot = $state.snapshot(selected_grammatical_classes);
            lockedFieldValuesStore.update((current) => ({ ...current, ['grammatical-classes']: snapshot }));
            is_locked = true;
        }
    }

    $effect(() => {
        GrammaticalClassService.readAll(dictionary_id).then(data => {
            available_classes = data.sort((a, b) => a.name.localeCompare(b.name));
        });
    });

    $effect(() => {
        if (!is_lockable) return;

        const lockedData = $lockedFieldValuesStore['grammatical-classes'] as I_GrammaticalClass[] | undefined;

        is_locked = !!lockedData;

        if (!is_locked) return;
        if (!lockedData) return;
        if (selected_grammatical_classes.length !== 0) return;

        selected_grammatical_classes = lockedData.map((gc) => gc);
    });
</script>

<style>

</style>

<div class="form-field-container space-y-2">
    <div class="flex flex-row justify-between items-center">
        <p class="font-bold">Classes grammaticales</p>
        {#if is_lockable}
            <IconButton icon={ is_locked ? LockOpen : Lock } text={ is_locked ? 'Déverrouiller' : 'Verrouiller' } variant={ is_locked ? 'active' : 'default' } onClick={ toggleLock } />
        {/if}
    </div>
    {#if available_classes.length > 0}
        <div class="grid grid-cols-4 gap-1">
            {#each available_classes as grammatical_class}
                <Checkbox name={ 'gc-' + grammatical_class.id } label={ grammatical_class.name } checked={ isChecked(grammatical_class) } onChange={ () => toggle(grammatical_class) } variant="minimal" disabled={ is_locked } />
            {/each}
        </div>
    {:else}
        <p>Aucune classe grammaticale n'a pu être récupérée.</p>
    {/if}
</div>