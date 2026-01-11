<script lang="ts">
    interface Props {
        placeholder: string;
        query: string;
    }

    let { placeholder, query = $bindable('') }: Props = $props();
    let id = crypto.randomUUID();
</script>

<style>

</style>

<div>
    <input type="text" { id } { placeholder } bind:value={ query } />
</div>