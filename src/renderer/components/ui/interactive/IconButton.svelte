<script lang="ts">
    import {Component} from "svelte";

    interface Props {
        icon: Component;
        text?: string;
        variant?: 'default' | 'active';
        onClick: () => void;
    }

    let { icon, text = undefined, variant = 'default', onClick }: Props = $props();

    let variant_class = $derived.by(() => {
        switch (variant) {
            case 'active':
                return 'icon-button--active';
            case 'default':
            default:
                return 'icon-button--default';
        }
    });

    let IconComponent = $derived.by(() => icon);
</script>

<style lang="postcss">
    @reference '../../../styles/styles.css';

    button {
        @apply py-1 border-2 rounded-md w-fit h-fit transition-colors duration-250 ease-out;
    }

    .icon-button--active {
        @apply bg-primary-400/15 border-primary-500;
    }

    .icon-button--default {
        @apply bg-base-10 border-base-40;
    }

    button:hover {
        @apply bg-accent-400/15 border-accent-500;
    }
</style>

<button type="button" onclick={ onClick } class="inline-flex flex-row gap-2 { text ? 'px-2' : 'px-1' } { variant_class }" >
    <IconComponent />
    {#if text}
        <span>{ text }</span>
    {/if}
</button>