import {Component} from "svelte";
import {LucideLifeBuoy, LucideSettings} from "@lucide/svelte";

export enum SpecialContentTab {
    Help = 'help',
    Settings = 'settings',
}

export namespace SpecialContentTab {
    export const all: SpecialContentTab[] = [
        SpecialContentTab.Help,
        SpecialContentTab.Settings
    ]

    export const labels: Record<SpecialContentTab, string> = {
        [SpecialContentTab.Help]: 'Aide',
        [SpecialContentTab.Settings]: 'Paramètres',
    }

    export const icons: Record<SpecialContentTab, Component> = {
        [SpecialContentTab.Help]: LucideLifeBuoy,
        [SpecialContentTab.Settings]: LucideSettings
    }
}