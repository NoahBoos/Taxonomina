<script lang="ts">
    import {ContentType} from "@/renderer/enums/ContentType";
    import {setContext} from "svelte";
    import {CONTENT_TYPE_KEY} from "@/renderer/utils/symbols";

    const contentType: ContentType = ContentType.GrammaticalClass;
    setContext(CONTENT_TYPE_KEY, contentType);
</script>

<style>

</style>

<div>

</div>