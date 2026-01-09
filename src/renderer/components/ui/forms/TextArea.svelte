<script lang="ts">
    let { name, label, rows, placeholder, value = $bindable() }: { name: string, label: string, rows: number, placeholder: string, value: string } = $props();
    let id = crypto.randomUUID();
</script>

<style>

</style>

<div>
    <label for={ id }>{ label }</label>
    <textarea { id } { name } { rows } { placeholder } bind:value={ value }></textarea>
</div>