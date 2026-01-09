<script lang="ts">
    let { name, label, placeholder, value = $bindable('') }: { name: string, label: string, placeholder: string, value: string | number } = $props();
    let id = crypto.randomUUID();
</script>

<style>

</style>

<div>
    <label for={ id }>{ label }</label>
    <input type="text" { id } { name } { placeholder } bind:value={ value } />
</div>