<script lang="ts">
    import {ContentType} from "@/renderer/enums/ContentType";
    import {setContext} from "svelte";

    const contentType: ContentType = ContentType.GrammaticalClass;
    const CONTENT_TYPE_KEY = Symbol('contentType');
    setContext(CONTENT_TYPE_KEY, contentType);
</script>

<style>

</style>

<div>

</div>