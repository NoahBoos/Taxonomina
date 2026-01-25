import {I_Language} from "../../../shared/interfaces/I_Language";

export class Language {
    constructor(
        public readonly id: number,
        public readonly dictionary_id: number,
        private _iso_639_1: string,
        private _iso_639_3: string,
        public is_conlang: boolean,
        private _name_native: string,
        private _name_local: string,
        public direction: string
    ) {
        this.iso_639_1 = _iso_639_1;
        this.iso_639_3 = _iso_639_3;
        this.name_native = _name_native;
        this.name_local = _name_local;
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

    public get name_local(): string {
        return this._name_local;
    }

    public set name_local(value: string) {
        this._name_local = value.trim().charAt(0).toUpperCase() + value.trim().slice(1);
    }

    public toJSON(): I_Language {
        return {
            id: this.id,
            dictionary_id: this.dictionary_id,
            iso_639_1: this.iso_639_1,
            iso_639_3: this.iso_639_3,
            is_conlang: this.is_conlang,
            name_native: this.name_native,
            name_local: this.name_local,
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
            raw.name_local,
            raw.direction
        );
    }

    public validate(): boolean {
        if (this.iso_639_1.length > 0 && this.iso_639_1.length !== 2) {
            console.warn("S'il existe, le code ISO 639-1 ne peut pas être d'une longueur autre que deux caractères. Laissez vide si vous avez fait une erreur.");
            return false;
        } else if (this.iso_639_3.length > 0 && this.iso_639_3.length !== 3) {
            console.warn("S'il existe, le code ISO 639-3 ne peut pas être d'une longueur autre que trois caractères. Laissez vide si vous avez fait une erreur.");
            return false;
        } else if (this.name_native.length === 0) {
            console.warn("Le nom natif d'une langue ne peut pas être vide.");
            return false;
        } else if (this.name_local.length === 0) {
            console.warn("Le nom local d'une langue ne peut pas être vide.");
            return false;
        }

        return true;
    }
}