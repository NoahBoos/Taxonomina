<script lang="ts">
    import {X} from "@lucide/svelte";

    interface Props {
        label: string;
        onRemove: (...args: any[]) => any;
    }

    let { label, onRemove }: Props = $props();
</script>

<style lang="postcss">
    @reference '../../../styles/styles.css';

    div {
        @apply flex flex-row items-center gap-2 px-2 py-1 border-2 rounded-lg border-base-40 bg-base-10 size-fit transition-colors duration-250 ease-out;
    }

    div:hover {
        @apply border-primary-300 bg-base-20;

        button {
            @apply block;
        }
    }

    div:not(:hover) button {
        @apply hidden;
    }

    button {
        @apply size-fit;
    }
</style>

<div>
    <p>{ label }</p>
    <button type="button" onclick={ onRemove }>
        <X size={ 16 } />
    </button>
</div>