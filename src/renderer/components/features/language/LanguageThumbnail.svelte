<script lang="ts">
    import {Language} from "@/renderer/types/Language";

    export let language: Language;
</script>

<style>

</style>

<div>
    <button>
        <span>{ language.name_native }</span>
        <span>{ language.name_local }</span>
    </button>
</div>