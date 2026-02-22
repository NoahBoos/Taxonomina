<script lang="ts">
    let { label }: { label: string } = $props();
</script>

<style lang="postcss">
    @reference '../../../styles/styles.css';

    button {
        @apply block font-semibold px-4 py-2 mx-auto border-2 rounded-md border-primary-500 bg-transparent w-fit transition-colors duration-250 ease-out;
    }

    button:hover {
        @apply bg-accent-400/15 border-accent-500;
    }
</style>

<button type="submit">
    { label }
</button>