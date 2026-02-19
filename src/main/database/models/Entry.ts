import {I_Entry} from "../../../shared/interfaces/I_Entry";
import { ErrorDomain, TaxonominaError } from "../../../shared/errors/types";
import { ENTRY_ERROR_REGISTRY } from "../../../shared/errors/registries/entryErrorRegistry";

export class Entry {
    constructor(
        public readonly id: number,
        public readonly dictionary_id: number,
        public language_id: number,
        private _lemma: string
    ) {
        this.lemma = _lemma;
    }

    public get lemma(): string {
        return this._lemma;
    }

    public set lemma(value: string) {
        this._lemma = value.trim().charAt(0).toUpperCase() + value.trim().slice(1);
    }

    public toJSON(): I_Entry {
        return {
            id: this.id,
            dictionary_id: this.dictionary_id,
            language_id: this.language_id,
            lemma: this.lemma
        }
    }

    public static hydrate(raw: I_Entry) {
        return new Entry(
            raw.id,
            raw.dictionary_id,
            raw.language_id,
            raw.lemma,
        );
    }

    public validate(): [boolean, TaxonominaError<ErrorDomain>[]] {
        let errors: TaxonominaError<ErrorDomain>[] = [];

        if (this.dictionary_id === 0) {
            errors.push(ENTRY_ERROR_REGISTRY.E0301);
        } else if (this.language_id === 0) {
            errors.push(ENTRY_ERROR_REGISTRY.E0302);
        } else if (this.lemma.length === 0) {
            errors.push(ENTRY_ERROR_REGISTRY.E0303);
        }

        return [errors.length === 0, errors];
    }
}