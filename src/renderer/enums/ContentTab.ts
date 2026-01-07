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

    export const browsers: Record<ContentTab, Component> = {
        [ContentTab.Language]: LanguageBrowser,
        [ContentTab.GrammaticalClass]: GrammaticalClassBrowser,
        [ContentTab.GrammaticalGenre]: GrammaticalGenreBrowser,
        [ContentTab.Entry]: EntryBrowser
    }

    export const thumbnails: Record<ContentTab, Component<{ item: any }>> = {
        [ContentTab.Language]: LanguageThumbnail,
        [ContentTab.GrammaticalClass]: GrammaticalClassThumbnail,
        [ContentTab.GrammaticalGenre]: GrammaticalGenreThumbnail,
        [ContentTab.Entry]: EntryThumbnail
    }

    export const icons: Record<ContentTab, Component> = {
        [ContentTab.Language]: LucideEarth,
        [ContentTab.GrammaticalClass]: LucideDna,
        [ContentTab.GrammaticalGenre]: LucideVenusAndMars,
        [ContentTab.Entry]: LucideStickyNote
    }

    export const labels: Record<ContentTab, string> = {
        [ContentTab.Language]: 'Langues',
        [ContentTab.GrammaticalClass]: 'Classes grammaticales',
        [ContentTab.GrammaticalGenre]: 'Genres grammaticaux',
        [ContentTab.Entry]: 'Entrées',
    }

    export const searchbarLabels: Record<ContentTab, string> = {
        [ContentTab.Language]: "Rechercher une langue...",
        [ContentTab.GrammaticalClass]: "Rechercher une classe grammaticale...",
        [ContentTab.GrammaticalGenre]: "Rechercher un genre grammatical...",
        [ContentTab.Entry]: "Rechercher une entrée..."
    }
}