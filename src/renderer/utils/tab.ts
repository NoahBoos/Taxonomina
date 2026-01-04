import {TabType} from "@/renderer/types/TabType";
import {ContentTab} from "@/renderer/enums/ContentTab";
import {SpecialContentTab} from "@/renderer/enums/SpecialContentTab";
import {Component} from "svelte";

export function getTabLabel(tab: TabType): string | undefined {
    const contentTab: ContentTab | undefined = ContentTab.all!.find?.((loopedTab) => loopedTab === tab);
    if (contentTab) return ContentTab.labels[contentTab];

    const specialContentTab: SpecialContentTab | undefined = SpecialContentTab.all!.find?.((loopedTab) => loopedTab === tab);
    if (specialContentTab) return SpecialContentTab.labels[specialContentTab];

    return undefined;
}

export function getTabIcon(tab: TabType): Component | undefined {
    const contentTab: ContentTab | undefined = ContentTab.all!.find?.((loopedTab) => loopedTab === tab);
    if (contentTab) return ContentTab.icons[contentTab];

    const specialContentTab: SpecialContentTab | undefined = SpecialContentTab.all!.find?.((loopedTab) => loopedTab === tab);
    if (specialContentTab) return SpecialContentTab.icons[specialContentTab];

    return undefined;
}