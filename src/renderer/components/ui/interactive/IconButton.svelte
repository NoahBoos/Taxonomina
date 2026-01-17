<script lang="ts">
    import {Component} from "svelte";

    interface Props {
        icon: Component;
        onClick: () => void;
    }

    let { icon, onClick }: Props = $props();

    let IconComponent = $derived.by(() => icon);
</script>

<style lang="postcss">
    @reference '../../../styles/styles.css';

    button {
        @apply p-1 border-2 rounded-md border-primary-300 w-fit transition-colors duration-250 ease-out;
    }

    button:hover {
        @apply text-base-90 border-primary-400 bg-primary-500;
    }
</style>

<button type="button" onclick={ onClick }>
    <IconComponent />
</button>