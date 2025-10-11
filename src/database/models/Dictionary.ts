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

    public GetQueryObject(): { id: number; name: string; description: string } {
        return {
            "id": this.id,
            "name": this.name,
            "description": this.description
        };
    }

    public static Hydrate(raw: any): Dictionary {
        return new Dictionary(raw.id, raw.name, raw.description);
    }
}