import {Component} from "svelte";
import LanguageBrowser from "@/renderer/components/features/language/LanguageBrowser.svelte";
import GrammaticalClassBrowser from "@/renderer/components/features/grammatical_class/GrammaticalClassBrowser.svelte";
import GrammaticalGenreBrowser from "@/renderer/components/features/grammatical_genre/GrammaticalGenreBrowser.svelte";
import EntryBrowser from "@/renderer/components/features/entry/EntryBrowser.svelte";
import {ContentType} from "@/renderer/enums/ContentType";

export const BROWSER_REGISTRY: Record<ContentType, Component> = {
    [ContentType.Language]: LanguageBrowser,
    [ContentType.GrammaticalClass]: GrammaticalClassBrowser,
    [ContentType.GrammaticalGenre]: GrammaticalGenreBrowser,
    [ContentType.Entry]: EntryBrowser
}