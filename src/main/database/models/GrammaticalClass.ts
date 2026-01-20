import {I_GrammaticalClass} from "../../../shared/interfaces/I_GrammaticalClass";

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

    public toDatabaseObject() {
        return {
            grammatical_class_id: this.id,
            dictionary_id: this.dictionary_id,
            name: this.name,
        }
    }

    public static hydrate(raw: I_GrammaticalClass): GrammaticalClass {
        return new GrammaticalClass(
            raw.id,
            raw.dictionary_id,
            raw.name
        );
    }

    public validate(): boolean {
        if (this.dictionary_id === 0) {
            console.warn("Une catégorie grammaticale ne peut pas appartenir à aucun dictionnaire.");
            return false;
        } else if (this.name.length === 0) {
            console.warn("Le nom d'une catégorie grammaticale ne peut pas être vide.");
            return false;
        }

        return true;
    }
}