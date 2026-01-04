export enum SpecialContentTab {
    Help,
    Settings
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