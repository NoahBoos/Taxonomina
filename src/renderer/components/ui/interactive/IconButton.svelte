<script lang="ts">
    import {Component} from "svelte";

    interface Props {
        icon: Component;
        text?: string;
        onClick: () => void;
    }

    let { icon, text = undefined, onClick }: Props = $props();

    let IconComponent = $derived.by(() => icon);
</script>

<style lang="postcss">
    @reference '../../../styles/styles.css';

    button {
        @apply py-1 border-2 rounded-md border-base-40 bg-base-10 w-fit h-fit transition-colors duration-250 ease-out;
    }

    button:hover {
        @apply bg-accent-400/15 border-accent-500;
    }
</style>

<button type="button" onclick={ onClick } class="flex flex-row gap-2 { text ? 'px-2' : 'px-1' }" >
    <IconComponent />
    {#if text}
        <span>{ text }</span>
    {/if}
</button>