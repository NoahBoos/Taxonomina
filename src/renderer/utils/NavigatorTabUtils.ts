import {BrowserContentTab} from "@/renderer/types/BrowserContentTab";
import {ContentType} from "@/renderer/enums/ContentType";
import {SpecialContentType} from "@/renderer/enums/SpecialContentType";
import {Component} from "svelte";

export class NavigatorTabUtils {
    public static getTabLabel(tab: BrowserContentTab): string | undefined {
        const contentTab: ContentType | undefined = ContentType.all!.find?.((loopedTab) => loopedTab === tab);
        if (contentTab) return ContentType.labels[contentTab];

        const specialContentTab: SpecialContentType | undefined = SpecialContentType.all!.find?.((loopedTab) => loopedTab === tab);
        if (specialContentTab) return SpecialContentType.labels[specialContentTab];

        return undefined;
    }

    public static getTabIcon(tab: BrowserContentTab): Component | undefined {
        const contentTab: ContentType | undefined = ContentType.all!.find?.((loopedTab) => loopedTab === tab);
        if (contentTab) return ContentType.icons[contentTab];

        const specialContentTab: SpecialContentType | undefined = SpecialContentType.all!.find?.((loopedTab) => loopedTab === tab);
        if (specialContentTab) return SpecialContentType.icons[specialContentTab];

        return undefined;
    }
}