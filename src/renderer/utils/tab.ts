import {TabType} from "@/renderer/types/TabType";
import {ContentTab} from "@/renderer/enums/ContentTab";
import {SpecialContentTab} from "@/renderer/enums/SpecialContentTab";

export function getTabLabel(tab: TabType): string {
    const contentTab: ContentTab | undefined = ContentTab.all!.find?.((loopedTab) => loopedTab === tab);
    if (contentTab) return ContentTab.labels[contentTab];

    const specialContentTab: SpecialContentTab | undefined = SpecialContentTab.all!.find?.((loopedTab) => loopedTab === tab);
    if (specialContentTab) return SpecialContentTab.labels[specialContentTab];

    return tab.toString();
}