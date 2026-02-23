import {I_Language} from "../../../shared/interfaces/I_Language";
import { ErrorDomain, TaxonominaError } from "../../../shared/errors/types";
import { LANGUAGE_ERROR_REGISTRY } from "../../../shared/errors/registries/languageErrorRegistry";

export class Language {
    constructor(
        public readonly id: number,
        public readonly dictionary_id: number,
        private _iso_639_1: string,
        private _iso_639_3: string,
        public is_conlang: boolean,
        private _name_native: string,
        private _name_localized: string,
        public direction: string
    ) {
        this.iso_639_1 = _iso_639_1;
        this.iso_639_3 = _iso_639_3;
        this.name_native = _name_native;
        this.name_localized = _name_localized;
    }

    public get iso_639_1(): string {
        return this._iso_639_1;
    }

    public set iso_639_1(value: string | null | undefined) {
        this._iso_639_1 = value ? value.trim().toLowerCase() : "";
    }

    public get iso_639_3(): string {
        return this._iso_639_3;
    }

    public set iso_639_3(value: string | null | undefined) {
        this._iso_639_3 = value ? value.trim().toLowerCase() : "";
    }

    public get name_native(): string {
        return this._name_native;
    }

    public set name_native(value: string) {
        this._name_native = value.trim().charAt(0).toUpperCase() + value.trim().slice(1);
    }

    public get name_localized(): string {
        return this._name_localized;
    }

    public set name_localized(value: string) {
        this._name_localized = value.trim().charAt(0).toUpperCase() + value.trim().slice(1);
    }

    public toJSON(): I_Language {
        return {
            id: this.id,
            dictionary_id: this.dictionary_id,
            iso_639_1: this.iso_639_1,
            iso_639_3: this.iso_639_3,
            is_conlang: this.is_conlang,
            name_native: this.name_native,
            name_localized: this.name_localized,
            direction: this.direction
        }
    }

    public static hydrate(raw: I_Language): Language {
        return new Language(
            raw.id,
            raw.dictionary_id,
            raw.iso_639_1,
            raw.iso_639_3,
            raw.is_conlang,
            raw.name_native,
            raw.name_localized,
            raw.direction
        );
    }

    public validate(): [boolean, TaxonominaError<ErrorDomain>[]] {
        let errors: TaxonominaError<ErrorDomain>[] = [];

        if (this.iso_639_1.length > 0 && this.iso_639_1.length !== 2) {
            errors.push(LANGUAGE_ERROR_REGISTRY.E0202);
        }
        if (this.iso_639_3.length > 0 && this.iso_639_3.length !== 3) {
            errors.push(LANGUAGE_ERROR_REGISTRY.E0203);
        }
        if (this.name_native.length === 0) {
            errors.push(LANGUAGE_ERROR_REGISTRY.E0204);
        }
        if (this.name_localized.length === 0) {
            errors.push(LANGUAGE_ERROR_REGISTRY.E0205);
        }

        if (errors.length === 0) {
            return [true, errors];
        } else {
            return [false, errors];
        }
    }
}