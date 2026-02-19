import {I_GrammaticalClass} from "../../../shared/interfaces/I_GrammaticalClass";
import { ErrorDomain, TaxonominaError } from "../../../shared/errors/types";
import { GRAMMATICAL_CLASS_ERROR_REGISTRY } from "../../../shared/errors/registries/grammaticalClassErrorRegistry";

export class GrammaticalClass {
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

    public toJSON(): I_GrammaticalClass {
        return {
            id: this.id,
            dictionary_id: this.dictionary_id,
            name: this.name
        }
    }

    public static hydrate(raw: I_GrammaticalClass): GrammaticalClass {
        return new GrammaticalClass(
            raw.id,
            raw.dictionary_id,
            raw.name
        );
    }

    public validate(): [boolean, TaxonominaError<ErrorDomain>[]] {
        let errors: TaxonominaError<ErrorDomain>[] = [];

        if (this.dictionary_id === 0) {
            errors.push(GRAMMATICAL_CLASS_ERROR_REGISTRY.E0501);
        } else if (this.name.length === 0) {
            errors.push(GRAMMATICAL_CLASS_ERROR_REGISTRY.E0502);
        }

        return [errors.length === 0, errors];
    }
}