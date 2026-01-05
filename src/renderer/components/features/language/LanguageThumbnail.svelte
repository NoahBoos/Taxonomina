<script lang="ts">
    import {I_Language} from "@/shared/interfaces/I_Language";

    export let language: I_Language;
</script>

<style>

</style>

<div>
    <button>
        <span>{ language.name_native }</span>
        <span>{ language.name_local }</span>
    </button>
</div>