<script lang="ts">
    import {Plus} from "@lucide/svelte";

    export let onClick: () => void;
</script>

<style>

</style>

<button on:click={onClick}>
    <Plus />
</button>