<script lang="ts">
    import {SelectOptions} from "@/renderer/types/SelectOptions";

    let { label, options, value = $bindable('') }: { label: string, options: SelectOptions, value: string | number } = $props();
    let id = crypto.randomUUID();
</script>

<style>

</style>

<div>
    <label for={ id }>{ label }</label>
    <select { id } bind:value={ value }>
        {#each Object.entries(options) as [option_value, option_label]}
            <option value={ option_value }>{ option_label }</option>
        {/each}
    </select>
</div>