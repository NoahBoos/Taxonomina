export class GrammaticalCategory {
    private readonly id: number;
    private name: string;

    constructor(id: number, name: string) {
        this.id = id;
        this.name = name;
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
}