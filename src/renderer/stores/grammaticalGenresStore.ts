import {settings} from "@/renderer/stores/settingsStore";
import { get, Writable, writable } from "svelte/store";
import { I_GrammaticalGenre } from "@/shared/interfaces/I_GrammaticalGenre";
import { GrammaticalGenreService } from "@/renderer/services/GrammaticalGenreService";

export const grammaticalGenresStore: Writable<I_GrammaticalGenre[]> = writable([]);

export async function refreshGrammaticalGenres(): Promise<void>  {
    const dictionary_id: number | undefined = get(settings)?.currentDictionary;

    if (dictionary_id) grammaticalGenresStore.set(await GrammaticalGenreService.readAll(dictionary_id));
    else grammaticalGenresStore.set([]);
}