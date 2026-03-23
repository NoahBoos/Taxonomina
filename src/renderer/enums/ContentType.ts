import {Component} from "svelte";
import {
    LucideDna,
    LucideEarth,
    LucideFolderTree, LucideLanguages,
    LucideStickyNote,
    LucideTags, LucideTickets,
    LucideVenusAndMars, Mars, SpellCheck
} from '@lucide/svelte';

export enum ContentType {
    Language = 'language',
    GrammaticalClass = 'grammatical-class',
    GrammaticalGenre = 'grammatical-genre',
    Entry = 'entry',
    Category = 'category',
}

export namespace ContentType {
    export const all: ContentType[] = [
        ContentType.Language,
        ContentType.GrammaticalClass,
        ContentType.GrammaticalGenre,
        ContentType.Entry,
        ContentType.Category,
    ]

    export const icons: Record<ContentType, Component> = {
        [ContentType.Language]: LucideLanguages,
        [ContentType.GrammaticalClass]: SpellCheck,
        [ContentType.GrammaticalGenre]: Mars,
        [ContentType.Entry]: LucideTickets,
        [ContentType.Category]: LucideTags,
    }

    export const labels: Record<ContentType, string> = {
        [ContentType.Language]: 'Langues',
        [ContentType.GrammaticalClass]: 'Classes grammaticales',
        [ContentType.GrammaticalGenre]: 'Genres grammaticaux',
        [ContentType.Entry]: 'Entrées',
        [ContentType.Category]: 'Catégories',
    }

    export const searchbarLabels: Record<ContentType, string> = {
        [ContentType.Language]: "Rechercher une langue...",
        [ContentType.GrammaticalClass]: "Rechercher une classe grammaticale...",
        [ContentType.GrammaticalGenre]: "Rechercher un genre grammatical...",
        [ContentType.Entry]: "Rechercher une entrée...",
        [ContentType.Category]: "Rechercher une catégorie...",
    }
}