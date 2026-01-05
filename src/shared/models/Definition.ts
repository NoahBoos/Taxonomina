import {I_Definition} from "@/shared/interfaces/I_Definition";

export class Definition {
    private readonly id: number;
    private definition: string;

    constructor(id: number, definition: string) {
        this.id = id;
        this.definition = definition;
    }

    public GetId(): number {
        return this.id;
    }

    public GetDefinition(): string {
        return this.definition;
    }
    public SetDefinition(definition: string) {
        this.definition = definition;
    }

    public GetQueryObject() {
        return {
            definition_id: this.id,
            definition: this.definition
        }
    }

    public ToJSON(): I_Definition {
        return {
            id: this.id,
            definition: this.definition
        }
    }

    public static Hydrate(raw: any): Definition {
        return new Definition(
            raw.id,
            raw.definition
        )
    }

    public Validate() {
        if (!this.definition.trim()) {
            console.warn("Une définition ne peut être vide, processus d'ajout des définitions annulé.")
            return false;
        }

        return true;
    }

    public Normalize() {
        this.definition = this.definition.charAt(0).toUpperCase() + this.definition.slice(1)
    }
}