<script lang="ts">
    import {SelectOptions} from "@/renderer/types/SelectOptions";

    interface Props {
        label: string;
        options: SelectOptions;
        value: string | number;
        onChange?: (value: string | number) => void;
    }

    let { label, options, value = $bindable(''), onChange }: Props = $props();
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
        @apply border-primary-300 bg-base-20;
    }
</style>

<div class="form-field-container space-y-2">
    <label for={ id }>{ label }</label>
    <select { id } bind:value={ internal_value } onchange={ handleOnChange }>
        {#each Object.entries(options) as [option_value, option_label]}
            <option value={ option_value }>{ option_label }</option>
        {/each}
    </select>
</div>