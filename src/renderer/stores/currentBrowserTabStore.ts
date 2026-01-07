import {Writable, writable} from "svelte/store";
import {TabType} from "@/renderer/types/TabType";

export const currentBrowserTabStore: Writable<TabType | null> = writable<TabType | null>(null);

export function updateCurrentBrowserTab(tab: TabType): void {
    currentBrowserTabStore.update(current => current === tab ? null : tab);
}