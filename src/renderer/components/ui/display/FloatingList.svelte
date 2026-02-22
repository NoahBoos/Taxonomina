<script lang="ts">
    interface Props {
        visible: boolean;
        children: any;
    }

    let { visible, children }: Props = $props();
</script>

<style lang="postcss">
    @reference '../../../styles/styles.css';

    div {
        @apply relative;
    }

    ul {
        @apply absolute top-full left-0 right-0 z-50 mt-1 border-2 rounded-md border-base-30 divide-y divide-base-30 bg-base-10 h-fit max-h-38 overflow-y-auto overflow-x-hidden transition-colors duration-250 ease-out;
    }
</style>

{#if visible}
    <div>
        <ul>
            {@render children()}
        </ul>
    </div>
{/if}