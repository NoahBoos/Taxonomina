import {Component} from "svelte";
import {LucideDna, LucideEarth, LucideStickyNote, LucideVenusAndMars} from '@lucide/svelte';
import EntryBrowser from "@/renderer/components/features/entry/EntryBrowser.svelte";
import GrammaticalClassBrowser from "@/renderer/components/features/grammatical_class/GrammaticalClassBrowser.svelte";
import GrammaticalGenreBrowser from "@/renderer/components/features/grammatical_genre/GrammaticalGenreBrowser.svelte";
import LanguageBrowser from "@/renderer/components/features/language/LanguageBrowser.svelte";
import LanguageThumbnail from "@/renderer/components/features/language/LanguageThumbnail.svelte";
import GrammaticalClassThumbnail from "@/renderer/components/features/grammatical_class/GrammaticalClassThumbnail.svelte";
import GrammaticalGenreThumbnail from "@/renderer/components/features/grammatical_genre/GrammaticalGenreThumbnail.svelte";
import EntryThumbnail from "@/renderer/components/features/entry/EntryThumbnail.svelte";

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

    export const thumbnails: Record<ContentType, Component<{ item: any }>> = {
        [ContentType.Language]: LanguageThumbnail,
        [ContentType.GrammaticalClass]: GrammaticalClassThumbnail,
        [ContentType.GrammaticalGenre]: GrammaticalGenreThumbnail,
        [ContentType.Entry]: EntryThumbnail
    }

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