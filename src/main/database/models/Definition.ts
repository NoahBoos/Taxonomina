import {I_Definition} from "../../../shared/interfaces/I_Definition";

export class Definition {
    constructor(
        public readonly id: number,
        private _definition: string
    ) {
        this.definition = _definition;
    }

    public get definition(): string {
        return this._definition;
    }

    public set definition(value: string) {
        this._definition = value.trim().charAt(0).toUpperCase() + value.trim().slice(1);
    }

    public toJSON(): I_Definition {
        return {
            id: this.id,
            definition: this.definition
        }
    }

    public static hydrate(raw: I_Definition): Definition {
        return new Definition(raw.id, raw.definition);
    }

    public validate(): boolean {
        if (this.definition.length === 0) {
            console.warn("Une définition ne peut être vide.");
            return false;
        }

        return true;
    }
}