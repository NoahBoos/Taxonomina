<script lang="ts">
    let { name, label, checked = $bindable(false)}: { name: string, label: string, checked?: boolean } = $props();
    let id = crypto.randomUUID();
</script>

<style>

</style>

<div>
    <label for={ id }>{ label }</label>
    <input type="checkbox" { id } { name } bind:checked={ checked } />
</div>