export class GrammaticalCase {
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

    public GetQueryObject() {
        return {
            grammatical_category_id: this.id,
            name: this.name,
        }
    }

    public ToJSON() {
        return {
            id: this.id,
            name: this.name
        }
    }
}