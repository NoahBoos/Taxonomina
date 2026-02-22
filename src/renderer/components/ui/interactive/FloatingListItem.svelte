<script lang="ts">
    interface Props {
        label: string;
        onClick: (...args: any[]) => void;
    }

    let { label, onClick }: Props = $props();
</script>

<style lang="postcss">
    @reference '../../../styles/styles.css';

    button {
        @apply text-left p-2 w-full max-h-9;
    }

    button:hover {
        @apply bg-base-20;
    }
</style>

<li>
    <button type="button" onclick={ onClick }>
        { label }
    </button>
</li>
