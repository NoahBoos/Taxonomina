<script lang="ts">
    import { ErrorDomain, TaxonominaError } from "@/shared/errors/types";

    interface Props {
        name: string,
        label: string,
        rows: number,
        placeholder: string,
        value: string,
        errors: TaxonominaError<ErrorDomain>[]
    }

    let { name, label, rows, placeholder, value = $bindable(), errors = [] }: Props = $props();
    let id = crypto.randomUUID();
</script>

<style>

</style>

<div>
    <label for={ id }>{ label }</label>
    <textarea { id } { name } { rows } { placeholder } bind:value={ value }></textarea>
</div>