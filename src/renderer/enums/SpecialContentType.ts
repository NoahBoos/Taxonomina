import {Component} from "svelte";
import {LucideLifeBuoy, LucideSettings} from "@lucide/svelte";

export enum SpecialContentType {
    Help = 'help',
    Settings = 'settings',
}

export namespace SpecialContentType {
    export const all: SpecialContentType[] = [
        SpecialContentType.Help,
        SpecialContentType.Settings
    ]

    export const labels: Record<SpecialContentType, string> = {
        [SpecialContentType.Help]: 'Aide',
        [SpecialContentType.Settings]: 'Paramètres',
    }

    export const icons: Record<SpecialContentType, Component> = {
        [SpecialContentType.Help]: LucideLifeBuoy,
        [SpecialContentType.Settings]: LucideSettings
    }
}