<script lang="ts">
    interface Props {
        placeholder: string;
        query: string;
        onfocus?: () => void;
        onblur?: () => void;
        variant?: 'default' | 'fit';
    }

    let { placeholder, query = $bindable(''), onfocus, onblur, variant = 'default' }: Props = $props();
    let id = crypto.randomUUID();
</script>

<style lang="postcss">
    @reference '../../../styles/styles.css';

    input {
        @apply px-2 py-1 border-2 rounded-lg border-base-40 bg-base-10 transition-colors duration-250 ease-out;
    }

    input:hover {
        @apply border-accent-500 bg-base-20;
    }
</style>

<input type="text" { id } { placeholder } bind:value={ query } { onfocus } { onblur } class="{ variant === 'default' ? 'w-full' : '' }" size="{ variant === 'fit' ? placeholder.length : undefined }" />