import {Component} from "svelte";
import {LucideDna, LucideEarth, LucideStickyNote, LucideVenusAndMars} from '@lucide/svelte';

export enum ContentType {
    Language = 'language',
    GrammaticalClass = 'grammatical-class',
    GrammaticalGenre = 'grammatical-genre',
    Entry = 'entry',
}

export namespace ContentType {
    export const all: ContentType[] = [
        ContentType.Language,
        ContentType.GrammaticalClass,
        ContentType.GrammaticalGenre,
        ContentType.Entry
    ]

    export const icons: Record<ContentType, Component> = {
        [ContentType.Language]: LucideEarth,
        [ContentType.GrammaticalClass]: LucideDna,
        [ContentType.GrammaticalGenre]: LucideVenusAndMars,
        [ContentType.Entry]: LucideStickyNote
    }

    export const labels: Record<ContentType, string> = {
        [ContentType.Language]: 'Langues',
        [ContentType.GrammaticalClass]: 'Classes grammaticales',
        [ContentType.GrammaticalGenre]: 'Genres grammaticaux',
        [ContentType.Entry]: 'Entrées',
    }

    export const searchbarLabels: Record<ContentType, string> = {
        [ContentType.Language]: "Rechercher une langue...",
        [ContentType.GrammaticalClass]: "Rechercher une classe grammaticale...",
        [ContentType.GrammaticalGenre]: "Rechercher un genre grammatical...",
        [ContentType.Entry]: "Rechercher une entrée..."
    }
}