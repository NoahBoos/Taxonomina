export enum EntryFormTabType {
    CATEGORIZATION = 'categorization',
    TRANSLATION = 'translation',
    DEFINITION = 'definition',
}

export namespace EntryFormTabType {
    export const all: EntryFormTabType[] = [
        EntryFormTabType.CATEGORIZATION,
        EntryFormTabType.DEFINITION,
        EntryFormTabType.TRANSLATION,
    ];

    export const labels: Record<EntryFormTabType, string> = {
        [EntryFormTabType.CATEGORIZATION]: 'Catégorisation',
        [EntryFormTabType.DEFINITION]: 'Définitions',
        [EntryFormTabType.TRANSLATION]: 'Traductions',
    }
}