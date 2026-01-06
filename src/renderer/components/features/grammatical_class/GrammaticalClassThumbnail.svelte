<script lang="ts">
    import {I_GrammaticalClass} from "@/shared/interfaces/I_GrammaticalClass";

    let { grammatical_class }: { grammatical_class: I_GrammaticalClass } = $props();
</script>

<style>

</style>

<div>
    <button>{ grammatical_class.name }</button>
</div>