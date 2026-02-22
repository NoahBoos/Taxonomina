import {I_Dictionary} from "../../../shared/interfaces/I_Dictionary";
import { ErrorDomain, TaxonominaError } from "../../../shared/errors/types";
import { DICTIONARY_ERROR_REGISTRY } from "../../../shared/errors/registries/dictionaryErrorRegistry";

export class Dictionary {
    constructor(
        public readonly id: number,
        private _name: string,
        public description: string
    ) {
        this.name = _name;
    }

    public get name(): string {
        return this._name;
    }

    public set name(value: string) {
        this._name = value.trim().charAt(0).toUpperCase() + value.trim().slice(1);
    }

    public toJSON(): I_Dictionary {
        return {
            id: this.id,
            name: this.name,
            description: this.description
        }
    }

    public static hydrate(raw: I_Dictionary): Dictionary {
        return new Dictionary(raw.id, raw.name, raw.description);
    }

    public validate(): [boolean, TaxonominaError<ErrorDomain>[]] {
        let errors: TaxonominaError<ErrorDomain>[] = [];

        if (this.name.length === 0) {
            errors.push(DICTIONARY_ERROR_REGISTRY.E0100);
        }

        return [errors.length === 0, errors];
    }
}