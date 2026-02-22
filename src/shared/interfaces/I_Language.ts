export interface I_Language {
    id: number;
    dictionary_id: number;
    iso_639_1: string;
    iso_639_3: string;
    is_conlang: boolean;
    name_native: string;
    name_local: string;
    direction: string;
}