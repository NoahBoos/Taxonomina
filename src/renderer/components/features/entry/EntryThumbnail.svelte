<script lang="ts">
    import {I_Entry} from "@/shared/interfaces/I_Entry";

    let { entry }: { entry: I_Entry } = $props();
</script>

<style>

</style>

<div>
    <button>{ entry.lemma }</button>
</div>