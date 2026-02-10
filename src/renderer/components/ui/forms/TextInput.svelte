<script lang="ts">
    let { name, label, placeholder, value = $bindable('') }: { name: string, label: string, placeholder: string, value: string | number } = $props();
    let id = crypto.randomUUID();
</script>

<style lang="postcss">
    @reference '../../../styles/styles.css';

    input {
        @apply px-2 py-1 border-2 rounded-lg border-base-40 bg-base-10 w-full transition-colors duration-250 ease-out;
    }

    input:hover {
        @apply border-accent-500 bg-base-20;
    }
</style>

<div class="form-field-container space-y-2">
    <label for={ id }>{ label }</label>
    <input type="text" { id } { name } { placeholder } bind:value={ value } />
</div>