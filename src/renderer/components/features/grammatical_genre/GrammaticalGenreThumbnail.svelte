<script lang="ts">
    import {I_GrammaticalGenre} from "@/shared/interfaces/I_GrammaticalGenre";

    let { item: grammatical_genre }: { item: I_GrammaticalGenre } = $props();
</script>

<style>

</style>

<div>
    <button>{ grammatical_genre.name }</button>
</div>