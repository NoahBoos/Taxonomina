<script lang="ts">
    import {I_Entry} from "@/shared/interfaces/I_Entry";

    let { item: entry }: { item: I_Entry } = $props();
</script>

<style>

</style>

<div>
    <button>{ entry.lemma }</button>
</div>