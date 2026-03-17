import { I_Language } from "./I_Language";
import { I_Definition } from "./I_Definition";
import { I_GrammaticalClass } from "./I_GrammaticalClass";
import { I_GrammaticalGenre } from "./I_GrammaticalGenre";

export interface I_Entry {
    id: number;
    dictionary_id: number;
    language_id: number;
    lemma: string;
    language: I_Language | undefined;
    grammatical_classes: I_GrammaticalClass[];
    grammatical_genres: I_GrammaticalGenre[];
    translations: I_Entry[];
    definitions: I_Definition[];
}