import {Writable, writable} from "svelte/store";
import {TabType} from "@/renderer/types/TabType";

export const currentTabStore: Writable<TabType | null> = writable<TabType | null>(null);

export function updateCurrentTab(tab: TabType): void {
    currentTabStore.update(current => current === tab ? null : tab);
}