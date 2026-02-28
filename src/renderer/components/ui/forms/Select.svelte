<script lang="ts">
    import {SelectOptions} from "@/renderer/types/SelectOptions";
    import { ErrorDomain, TaxonominaError } from "@/shared/errors/types";
    import { Lock, LockOpen } from "@lucide/svelte";
    import { lockedFieldValuesStore } from "@/renderer/stores/lockedFieldValuesStore";
    import IconButton from "@/renderer/components/ui/interactive/IconButton.svelte";

    interface Props {
        name: string;
        label: string;
        options: SelectOptions;
        value: string | number;
        onChange?: (value: string | number) => void;
        is_lockable?: boolean;
        errors?: TaxonominaError<ErrorDomain>[];
    }

    let { name, label, options, value = $bindable(''), onChange, is_lockable = false, errors = [] }: Props = $props();
    let id = crypto.randomUUID();

    let is_locked = $state(false);

    function toggleLock() {
        if (is_locked) {
            delete $lockedFieldValuesStore[name];
            is_locked = false;
        } else {
            $lockedFieldValuesStore[name] = value;
            is_locked = true;
        }
    }

    let internal_value = $derived(String(value));

    function handleOnChange(event: Event) {
        const target = event.target as HTMLSelectElement;
        const rawValue = target.value;
        const numericValue = Number(rawValue);
        value = (!isNaN(numericValue)) && rawValue !== '' ? numericValue : rawValue;

        if (onChange) onChange(value);
    }

    $effect(() => {
        if (!is_lockable) return;

        if (name in $lockedFieldValuesStore) {
            value = $lockedFieldValuesStore[name];
            is_locked = true;
        }
    });
</script>

<style lang="postcss">
    @reference '../../../styles/styles.css';

    select {
        @apply px-2 py-1 border-2 rounded-lg border-base-40 bg-base-10 w-full transition-colors duration-250 ease-out;
    }

    select:hover {
        @apply border-accent-500 bg-base-20;
    }
</style>

<div class="form-field-container flex flex-col gap-2 { errors.length > 0 ? 'form-field-container--errors' : '' }">
    <div class="flex-1 flex flex-row justify-between items-center">
        <label for={ id }>{ label }</label>
        {#if is_lockable}
            <IconButton icon={ is_locked ? LockOpen : Lock } text={ is_locked ? 'Déverrouiller' : 'Verrouiller' } onClick={ toggleLock } />
        {/if}
    </div>
    <select { id } bind:value={ internal_value } onchange={ handleOnChange } disabled={ is_locked } >
        {#each Object.entries(options) as [option_value, option_label]}
            <option value={ option_value }>{ option_label }</option>
        {/each}
    </select>
    {#if errors.length > 0}
        <div>
            {#each errors as error}
                <p>{ error.code } : { error.message }</p>
            {/each}
        </div>
    {/if}
</div>