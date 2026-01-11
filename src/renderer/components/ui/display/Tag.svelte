<script lang="ts">
    import {X} from "@lucide/svelte";

    interface Props {
        label: string;
        onRemove: (...args: any[]) => any;
    }

    let { label, onRemove }: Props = $props();
</script>

<style>

</style>

<div>
    <p>{ label }</p>
    <button type="button" onclick={ onRemove }>
        <X />
    </button>
</div>