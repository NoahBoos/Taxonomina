<script lang="ts">
    import { Plus } from "@lucide/svelte";
    import { currentInspectorStateStore } from "@/renderer/stores/currentInspectorStateStore";
    import { InspectorAction } from "@/renderer/enums/InspectorAction";
    import { ContentType } from "@/renderer/enums/ContentType";

    interface Props {
        onClick: () => void;
        contentType: ContentType;
    }

    let { onClick, contentType }: Props = $props();

    let is_selected: boolean =  $derived($currentInspectorStateStore.category === 'content' && $currentInspectorStateStore.type === contentType && $currentInspectorStateStore.action === InspectorAction.CREATE);
</script>

<style lang="postcss">
    @reference '../../styles/styles.css';

    .add-content-button {
        @apply text-base-100 p-1 border-2 rounded-md border-base-40 bg-base-10 w-fit transition-colors duration-250 ease-out;
    }

    .add-content-button:hover {
        @apply bg-accent-400/15 border-accent-500;
    }

    .selected {
        @apply border-primary-500 bg-primary-400/15;
    }
</style>

<button onclick={ onClick } class="add-content-button { is_selected ? 'selected' : '' }">
    <Plus />
</button>