import {settings} from "@/renderer/stores/settingsStore";
import { get, Writable, writable } from "svelte/store";
import { I_GrammaticalGenre } from "@/shared/interfaces/I_GrammaticalGenre";
import { GrammaticalGenreService } from "@/renderer/services/GrammaticalGenreService";

export const grammaticalGenresStore: Writable<I_GrammaticalGenre[]> = writable([]);

export async function refreshGrammaticalGenres(): Promise<void>  {
    const dictionary_id: number | undefined = get(settings)?.currentDictionary;

    if (dictionary_id) {
        let grammatical_genres: I_GrammaticalGenre[] = await GrammaticalGenreService.readAll(dictionary_id);
        grammatical_genres.sort((a, b) => a.name.localeCompare(b.name));

        grammaticalGenresStore.set(grammatical_genres);
    }
    else grammaticalGenresStore.set([]);
}