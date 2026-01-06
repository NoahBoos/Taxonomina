<script lang="ts">
    import {I_Language} from "@/shared/interfaces/I_Language";

    let { language }: { language: I_Language } = $props();
</script>

<style>

</style>

<div>
    <button>
        <span>{ language.name_native }</span>
        <span>{ language.name_local }</span>
    </button>
</div>