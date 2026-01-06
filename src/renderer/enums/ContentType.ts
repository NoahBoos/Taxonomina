import {ContentTab} from "@/renderer/enums/ContentTab";

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

    export const searchBarLabels: Record<ContentTab, string> = {
        [ContentType.Language]: "Rechercher une langue...",
        [ContentType.GrammaticalClass]: "Rechercher une classe grammaticale...",
        [ContentType.GrammaticalGenre]: "Rechercher un genre grammatical...",
        [ContentType.Entry]: "Rechercher une entrée..."
    }
}