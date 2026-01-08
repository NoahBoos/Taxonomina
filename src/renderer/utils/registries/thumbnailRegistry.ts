import {Component} from "svelte";
import LanguageThumbnail from "@/renderer/components/features/language/LanguageThumbnail.svelte";
import GrammaticalClassThumbnail from "@/renderer/components/features/grammatical_class/GrammaticalClassThumbnail.svelte";
import GrammaticalGenreThumbnail from "@/renderer/components/features/grammatical_genre/GrammaticalGenreThumbnail.svelte";
import EntryThumbnail from "@/renderer/components/features/entry/EntryThumbnail.svelte";
import {ContentType} from "@/renderer/enums/ContentType";

export const THUMBNAIL_REGISTRY: Record<ContentType, Component<{ item: any }>> = {
    [ContentType.Language]: LanguageThumbnail,
    [ContentType.GrammaticalClass]: GrammaticalClassThumbnail,
    [ContentType.GrammaticalGenre]: GrammaticalGenreThumbnail,
    [ContentType.Entry]: EntryThumbnail
}