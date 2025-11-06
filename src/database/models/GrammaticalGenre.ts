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
            grammatical_genre_id: this.id,
            name: this.name,
        }
    }

    public static Hydrate(raw: any): GrammaticalGenre {
        return new GrammaticalGenre(
            raw.id,
            raw.name,
        );
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