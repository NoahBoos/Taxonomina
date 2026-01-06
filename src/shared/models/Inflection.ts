export class Inflection {
    private readonly id: number;
    private readonly entry_id: number;
    private inflection: string;

    constructor(id: number, entry_id: number, inflection: string) {
        this.id = id;
        this.entry_id = entry_id;
        this.inflection = inflection;
    }

    public GetId(): number {
        return this.id;
    }

    public GetEntryId(): number {
        return this.entry_id;
    }

    public GetInflection(): string {
        return this.inflection;
    }
    public SetInflection(inflection: string) {
        this.inflection = inflection;
    }

    public GetQueryObject() {
        return {
            inflection_id: this.id,
            entry_id: this.entry_id,
            inflection: this.inflection,
        }
    }

    public ToJSON() {
        return {
            id: this.id,
            entry_id: this.entry_id,
            inflection: this.inflection
        }
    }
}