<script lang="ts">
    import {SelectOptions} from "@/renderer/types/SelectOptions";

    interface Props {
        label: string;
        options: SelectOptions;
        value: string | number;
        onChange?: (...args: any[]) => void;
    }

    let { label, options, value = $bindable(''), onChange } = $props();
    let id = crypto.randomUUID();
</script>

<style>

</style>

<div>
    <label for={ id }>{ label }</label>
    <select { id } bind:value={ value } onchange={ onChange }>
        {#each Object.entries(options) as [option_value, option_label]}
            <option value={ option_value }>{ option_label }</option>
        {/each}
    </select>
</div>