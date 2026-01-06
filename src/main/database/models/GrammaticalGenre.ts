import {I_GrammaticalGenre} from "../../../shared/interfaces/I_GrammaticalGenre";

export class GrammaticalGenre {
    private readonly id: number;
    private dictionary_id: number;
    private name: string;

    constructor(id: number, dictionary_id: number, name: string) {
        this.id = id;
        this.dictionary_id = dictionary_id;
        this.name = name;
    }

    public GetId(): number {
        return this.id;
    }

    public GetDictionaryId(): number {
        return this.dictionary_id;
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
            dictionary_id: this.dictionary_id,
            name: this.name,
        }
    }

    public ToJSON(): I_GrammaticalGenre {
        return {
            id: this.id,
            dictionary_id: this.dictionary_id,
            name: this.name
        }
    }

    public static Hydrate(raw: any): GrammaticalGenre {
        return new GrammaticalGenre(
            raw.id,
            raw.dictionary_id,
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