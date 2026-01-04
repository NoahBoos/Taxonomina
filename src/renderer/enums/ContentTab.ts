import {Component} from "svelte";
import {LucideDna, LucideEarth, LucideStickyNote, LucideVenusAndMars} from '@lucide/svelte';
import EntryBrowser from "@/renderer/components/entry/EntryBrowser.svelte";
import GrammaticalClassBrowser from "@/renderer/components/grammatical_class/GrammaticalClassBrowser.svelte";
import GrammaticalGenreBrowser from "@/renderer/components/grammatical_genre/GrammaticalGenreBrowser.svelte";
import LanguageBrowser from "@/renderer/components/language/LanguageBrowser.svelte";
import {ContentType} from "@/renderer/enums/ContentType";

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

    export const contents: Record<ContentTab, ContentType> = {
        [ContentTab.Language]: ContentType.Language,
        [ContentTab.GrammaticalClass]: ContentType.GrammaticalClass,
        [ContentTab.GrammaticalGenre]: ContentType.GrammaticalGenre,
        [ContentTab.Entry]: ContentType.Entry,
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
}