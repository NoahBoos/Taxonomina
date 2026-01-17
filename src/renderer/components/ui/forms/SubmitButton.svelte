<script lang="ts">
    let { label }: { label: string } = $props();
</script>

<style lang="postcss">
    @reference '../../../styles/styles.css';

    button {
        @apply block font-semibold px-4 py-2 mx-auto border-2 rounded-md border-base-40 bg-base-10 w-fit transition-colors duration-250 ease-out;
    }

    button:hover {
        @apply border-primary-300 bg-base-20;
    }
</style>

<button type="submit">
    { label }
</button>