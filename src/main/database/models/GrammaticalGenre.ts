import {I_GrammaticalGenre} from "../../../shared/interfaces/I_GrammaticalGenre";
import { ErrorDomain, TaxonominaError } from "../../../shared/errors/types";
import { GRAMMATICAL_GENRE_ERROR_REGISTRY } from "../../../shared/errors/registries/grammaticalGenreErrorRegistry";

export class GrammaticalGenre {
    constructor(
        public readonly id: number,
        public readonly dictionary_id: number,
        private _name: string
    ) {
        this.name = _name;
    }

    public get name(): string {
        return this._name;
    }

    public set name(value: string) {
        this._name = value.trim().charAt(0).toUpperCase() + value.trim().slice(1);
    }

    public toJSON(): I_GrammaticalGenre {
        return {
            id: this.id,
            dictionary_id: this.dictionary_id,
            name: this.name
        }
    }

    public static hydrate(raw: I_GrammaticalGenre): GrammaticalGenre {
        return new GrammaticalGenre(
            raw.id,
            raw.dictionary_id,
            raw.name,
        );
    }

    public validate(): [boolean, TaxonominaError<ErrorDomain>[]] {
        let errors: TaxonominaError<ErrorDomain>[] = [];

        if (this.dictionary_id === 0) {
            errors.push(GRAMMATICAL_GENRE_ERROR_REGISTRY.E0601);
        }
        if (this.name.length === 0) {
            errors.push(GRAMMATICAL_GENRE_ERROR_REGISTRY.E0602);
        }

        return [errors.length === 0, errors];
    }
}