<script lang="ts">
    import {onMount} from "svelte";
    import {currentDictionary, refreshCurrentDictionary} from "@/renderer/stores/currentDictionaryStore";

    onMount(() => { refreshCurrentDictionary() });
</script>

<style>

</style>

<div>
    <button type="button">
        <span>{ $currentDictionary?.name }</span>
        <span>{ $currentDictionary?.description }</span>
    </button>
</div>