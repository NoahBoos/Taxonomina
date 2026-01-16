<script lang="ts">
    import {Plus} from "@lucide/svelte";

    let { onClick }: { onClick: () => void } = $props();
</script>

<style lang="postcss">
    @reference '../../styles/styles.css';

    .add-content-button {
        @apply text-base-100 p-1 border-2 rounded-md border-primary-300 w-fit transition-colors duration-250 ease-out;
    }

    .add-content-button:hover {
        @apply text-base-90 border-primary-400 bg-primary-500;
    }
</style>

<button onclick={ onClick } class="add-content-button">
    <Plus />
</button>