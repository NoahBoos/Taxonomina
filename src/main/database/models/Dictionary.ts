import {I_Dictionary} from "../../../shared/interfaces/I_Dictionary";

export class Dictionary {
    private readonly id: number;
    private name: string;
    private description: string;

    constructor(id: number, name: string, description: string) {
        this.id = id;
        this.name = name;
        this.description = description;
    }

    public GetId(): number {
        return this.id;
    }

    public GetName(): string {
        return this.name;
    }
    public SetName(name: string) {
        this.name = name;
    }

    public GetDescription(): string {
        return this.description;
    }
    public SetDescription(description: string) {
        this.description = description;
    }

    public GetQueryObject() {
        return {
            dictionary_id: this.id,
            name: this.name,
            description: this.description
        };
    }

    public ToJSON(): I_Dictionary {
        return {
            id: this.id,
            name: this.name,
            description: this.description
        }
    }

    public static Hydrate(raw: any): Dictionary {
        return new Dictionary(raw.id, raw.name, raw.description);
    }

    public Validate(): boolean {
        if (!this.name.trim()) {
            return false;
        }

        return true;
    }

    public Normalize(): void {
        this.name = this.name.charAt(0).toUpperCase() + this.name.slice(1);
    }
}