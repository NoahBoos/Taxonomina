<script lang="ts">
    import {BrowserContentTab} from "@/renderer/types/BrowserContentTab";
    import { NavigatorTabUtils } from "@/renderer/utils/NavigatorTabUtils";
    import { currentBrowserTabStore } from "@/renderer/stores/currentBrowserTabStore";
    import { currentInspectorStateStore } from "@/renderer/stores/currentInspectorStateStore";
    import { SpecialContentType } from "@/renderer/enums/SpecialContentType";
    import { SPECIAL_CONTENT_INSPECTOR_STATES } from "@/renderer/utils/registries/inspectorRegistry";

    interface Props {
        tab: BrowserContentTab;
        onClick: (...args: any[]) => void;
    }

    let { tab, onClick }: Props = $props();

    let label = $derived(NavigatorTabUtils.getTabLabel(tab));
    let IconComponent = $derived.by(() => NavigatorTabUtils.getTabIcon(tab));

    let is_selected: boolean = $derived(
        ($currentBrowserTabStore && tab === $currentBrowserTabStore)
        || ($currentInspectorStateStore === SPECIAL_CONTENT_INSPECTOR_STATES[tab as SpecialContentType])
    );
</script>

<style lang="postcss">
    @reference '../../styles/styles.css';

    .tab-button {
        @apply text-left text-base flex flex-row items-center gap-2 p-2 border-2 border-base-40 rounded-md bg-base-10 w-full transition-colors duration-250 ease-out;
    }

    .tab-button:hover {
        @apply hover:bg-accent-400/15 border-accent-500;
    }

    .selected {
        @apply border-primary-500 bg-primary-400/15;
    }
</style>

<button onclick={ onClick } class="tab-button { is_selected ? 'selected' : '' }">
    <IconComponent /> { label }
</button>