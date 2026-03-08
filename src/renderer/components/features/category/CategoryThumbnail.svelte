<script lang="ts">
    import { I_Category } from "@/shared/interfaces/I_Category";
    import { currentInspectorStateStore, setCurrentInspectorState } from "@/renderer/stores/currentInspectorStateStore";
    import { ContentType } from "@/renderer/enums/ContentType";
    import { INSPECTOR_STATE_PRESETS } from "@/renderer/utils/inspectorStatePresets";

    interface Props {
        item: I_Category;
    }

    let { item: category }: Props = $props();

    let is_selected: boolean = $derived($currentInspectorStateStore.category === 'content' && $currentInspectorStateStore.type === ContentType.Category && $currentInspectorStateStore.id !== undefined && $currentInspectorStateStore.id === category.id);

    function openReadOneView() {
        setCurrentInspectorState(INSPECTOR_STATE_PRESETS.CONTENT.CATEGORY.READ_ONE(category.id));
    }
</script>

<style lang="postcss">
    @reference '../../../styles/styles.css';

    .category-thumbnail {
        @apply text-base-100 text-left p-2 border-2 border-base-40 rounded-md w-full h-fit font-bold bg-base-10 transition-colors duration-250 ease-out;
    }

    .category-thumbnail:hover {
        @apply border-accent-500 bg-accent-400/15;
    }

    .selected {
        @apply border-primary-500 bg-primary-400/15;
    }
</style>

<div>
    <button onclick={ openReadOneView } class="category-thumbnail { is_selected ? 'selected' : '' }">{ category.name }</button>
</div>