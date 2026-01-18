<script lang="ts">
    interface Props {
        placeholder: string;
        query: string;
        onfocus?: () => void;
        onblur?: () => void;
    }

    let { placeholder, query = $bindable(''), onfocus, onblur }: Props = $props();
    let id = crypto.randomUUID();
</script>

<style lang="postcss">
    @reference '../../../styles/styles.css';

    input {
        @apply px-2 py-1 border-2 rounded-lg border-base-40 bg-base-10 w-full transition-colors duration-250 ease-out;
    }

    input:hover {
        @apply border-primary-300 bg-base-20;
    }
</style>

<input type="text" { id } { placeholder } bind:value={ query } { onfocus } { onblur } />