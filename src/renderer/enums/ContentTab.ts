export enum ContentTab {
    Language,
    GrammaticalClass,
    GrammaticalGenre,
    Entry
}

export namespace ContentTab {
    export const all: ContentTab[] = [
        ContentTab.Language,
        ContentTab.GrammaticalClass,
        ContentTab.GrammaticalGenre,
        ContentTab.Entry
    ]

    export const labels: Record<ContentTab, string> = {
        [ContentTab.Language]: 'Langues',
        [ContentTab.GrammaticalClass]: 'Classes grammaticales',
        [ContentTab.GrammaticalGenre]: 'Genres grammaticaux',
        [ContentTab.Entry]: 'Entrées',
    }
}