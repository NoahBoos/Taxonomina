<script lang="ts">
    import {Plus} from "@lucide/svelte";

    let { onClick }: { onClick: () => {} } = $props();
</script>

<style>

</style>

<button onclick={ onClick }>
    <Plus />
</button>