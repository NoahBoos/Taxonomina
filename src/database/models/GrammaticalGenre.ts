export class GrammaticalGenre {
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
            id: this.id,
            name: this.name,
        }
    }

    public static Hydrate(raw: any): GrammaticalGenre {
        return new GrammaticalGenre(
            raw.id,
            raw.name,
        );
    }
}