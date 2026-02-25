<script lang="ts">
    interface Props {
        label: string;
        onClick?: () => void;
        variant?: 'uncentered' | 'centered';
    }

    let { label, onClick, variant = 'centered' }: Props = $props();
</script>

<style lang="postcss">
    @reference '../../../styles/styles.css';

    button {
        @apply block font-semibold px-4 py-2 border-2 rounded-md border-primary-500 bg-transparent w-fit transition-colors duration-250 ease-out;
    }

    button:hover {
        @apply bg-accent-400/15 border-accent-500;
    }
</style>

<button type="submit" onclick={ onClick } class="{ variant === 'centered' ? 'mx-auto' : '' }">
    { label }
</button>