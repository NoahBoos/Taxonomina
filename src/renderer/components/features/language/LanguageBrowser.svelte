<script lang="ts">
    import {ContentType} from "@/renderer/enums/ContentType";
    import {setContext} from "svelte";

    const contentType: ContentType = ContentType.Language;
    setContext(CONTENT_TYPE_KEY, contentType);
</script>

<style>

</style>

<div>

</div>