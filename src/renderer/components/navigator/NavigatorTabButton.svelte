<script lang="ts">
    import {BrowserContentTab} from "@/renderer/types/BrowserContentTab";
    import { NavigatorTabUtils } from "@/renderer/utils/NavigatorTabUtils";

    interface Props {
        tab: BrowserContentTab;
        onClick: (...args: any[]) => void;
    }

    let { tab, onClick }: Props = $props();

    let label = $derived(NavigatorTabUtils.getTabLabel(tab));
    let IconComponent = $derived.by(() => NavigatorTabUtils.getTabIcon(tab));
</script>

<style lang="postcss">
    @reference '../../styles/styles.css';

    .tab-button {
        @apply text-left text-base flex flex-row items-center gap-2 p-2 border-2 border-base-40 rounded-md bg-base-10 w-full transition-colors duration-250 ease-out;
    }

    .tab-button:hover {
        @apply text-base-90 hover:bg-base-30 border-primary-400;
    }
</style>

<button onclick={ onClick } class="tab-button">
    <IconComponent /> { label }
</button>