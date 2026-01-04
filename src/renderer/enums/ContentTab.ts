import {Component} from "svelte";
import {LucideDna, LucideEarth, LucideStickyNote, LucideVenusAndMars} from '@lucide/svelte';

export enum ContentTab {
    Language = 'language',
    GrammaticalClass = 'grammatical-class',
    GrammaticalGenre = 'grammatical-genre',
    Entry = 'entry',
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

    export const icons: Record<ContentTab, Component> = {
        [ContentTab.Language]: LucideEarth,
        [ContentTab.GrammaticalClass]: LucideDna,
        [ContentTab.GrammaticalGenre]: LucideVenusAndMars,
        [ContentTab.Entry]: LucideStickyNote
    }
}