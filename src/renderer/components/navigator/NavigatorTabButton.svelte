<script lang="ts">
    import {BrowserContentTab} from "@/renderer/types/BrowserContentTab";
    import {getTabIcon, getTabLabel} from "@/renderer/utils/tab";

    interface Props {
        tab: BrowserContentTab;
        onClick: (...args: any[]) => void;
    }

    let { tab, onClick }: Props = $props();

    let label = $derived(getTabLabel(tab));
    let IconComponent = $derived.by(() => getTabIcon(tab));
</script>

<style>

</style>

<button onclick={ onClick }>
    <IconComponent /> { label }
</button>