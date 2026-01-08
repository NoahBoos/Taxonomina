import {Writable, writable} from "svelte/store";
import {BrowserContentTab} from "@/renderer/types/BrowserContentTab";

export const currentBrowserTabStore: Writable<BrowserContentTab | null> = writable<BrowserContentTab | null>(null);

export function updateCurrentBrowserTab(tab: BrowserContentTab): void {
    currentBrowserTabStore.update(current => current === tab ? null : tab);
}