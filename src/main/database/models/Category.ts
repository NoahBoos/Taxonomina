import { I_Category } from "../../../shared/interfaces/I_Category";
import { ErrorDomain, TaxonominaError } from "../../../shared/errors/types";
import { CATEGORY_ERROR_REGISTRY } from "../../../shared/errors/registries/categoryErrorRegistry";

export class Category {
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

    public toJSON() {
        return {
            id: this.id,
            dictionary_id: this.dictionary_id,
            name: this.name
        }
    }

    public static hydrate(raw: I_Category): Category {
        return new Category(
            raw.id,
            raw.dictionary_id,
            raw.name
        );
    }

    public validate(): [boolean, TaxonominaError<ErrorDomain>[]] {
        let errors: TaxonominaError<ErrorDomain>[] = [];

        if (this.dictionary_id === 0) {
            errors.push(CATEGORY_ERROR_REGISTRY.E0701);
        }
        if (this.name.length === 0) {
            errors.push(CATEGORY_ERROR_REGISTRY.E0702);
        }

        return [errors.length === 0, errors];
    }
}