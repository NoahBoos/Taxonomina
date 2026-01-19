import {I_Dictionary} from "../../../shared/interfaces/I_Dictionary";

export class Dictionary {
    constructor(
        public readonly id: number,
        private _name: string,
        public description: string
    ) {
        this.id = id;
        this.name = _name;
        this.description = description;
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

    public toDatabaseObject() {
        return {
            dictionary_id: this.id,
            name: this.name,
            description: this.description
        };
    }

    public static hydrate(raw: I_Dictionary): Dictionary {
        return new Dictionary(raw.id, raw.name, raw.description);
    }

    public validate(): boolean {
        if (this.name.length === 0) {
            console.warn("Un dictionnaire ne peut être vide.");
            return false;
        }

        return true;
    }
}