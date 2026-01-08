import {BrowserContentTab} from "@/renderer/types/BrowserContentTab";
import {ContentType} from "@/renderer/enums/ContentType";
import {SpecialContentTab} from "@/renderer/enums/SpecialContentTab";
import {Component} from "svelte";

export function getTabLabel(tab: BrowserContentTab): string | undefined {
    const contentTab: ContentType | undefined = ContentType.all!.find?.((loopedTab) => loopedTab === tab);
    if (contentTab) return ContentType.labels[contentTab];

    const specialContentTab: SpecialContentTab | undefined = SpecialContentTab.all!.find?.((loopedTab) => loopedTab === tab);
    if (specialContentTab) return SpecialContentTab.labels[specialContentTab];

    return undefined;
}

export function getTabIcon(tab: BrowserContentTab): Component | undefined {
    const contentTab: ContentType | undefined = ContentType.all!.find?.((loopedTab) => loopedTab === tab);
    if (contentTab) return ContentType.icons[contentTab];

    const specialContentTab: SpecialContentTab | undefined = SpecialContentTab.all!.find?.((loopedTab) => loopedTab === tab);
    if (specialContentTab) return SpecialContentTab.icons[specialContentTab];

    return undefined;
}