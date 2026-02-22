<script lang="ts">
    import {SelectOptions} from "@/renderer/types/SelectOptions";
    import { ErrorDomain, TaxonominaError } from "@/shared/errors/types";

    interface Props {
        label: string;
        options: SelectOptions;
        value: string | number;
        onChange?: (value: string | number) => void;
        errors?: TaxonominaError<ErrorDomain>[];
    }

    let { label, options, value = $bindable(''), onChange, errors = [] }: Props = $props();
    let id = crypto.randomUUID();

    let internal_value = $derived(String(value));

    function handleOnChange(event: Event) {
        const target = event.target as HTMLSelectElement;
        const rawValue = target.value;
        const numericValue = Number(rawValue);
        value = (!isNaN(numericValue)) && rawValue !== '' ? numericValue : rawValue;

        if (onChange) onChange(value);
    }
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

<div class="form-field-container space-y-2 { errors.length > 0 ? 'form-field-container--errors' : '' }">
    <label for={ id }>{ label }</label>
    <select { id } bind:value={ internal_value } onchange={ handleOnChange }>
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