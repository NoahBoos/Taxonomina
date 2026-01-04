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
}