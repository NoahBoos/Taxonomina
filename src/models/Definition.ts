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
}