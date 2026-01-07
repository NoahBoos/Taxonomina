<script lang="ts">
    import {I_GrammaticalClass} from "@/shared/interfaces/I_GrammaticalClass";

    let { item: grammatical_class }: { item: I_GrammaticalClass } = $props();
</script>

<style>

</style>

<div>
    <button>{ grammatical_class.name }</button>
</div>