<script lang="ts">
    import {Component} from "svelte";

    interface Props {
        icon: Component;
        onClick: () => void;
    }

    let { icon, onClick }: Props = $props();

    let IconComponent = $derived.by(() => icon);
</script>

<style>

</style>

<button type="button" onclick={ onClick }>
    <IconComponent />
</button>