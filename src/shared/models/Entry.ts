export class Entry {
    private readonly id: number;
    private readonly dictionary_id: number;
    private language_id: number;
    private lemma: string;

    constructor(id: number, dictionary_id: number, language_id: number, lemma: string) {
        this.id = id;
        this.dictionary_id = dictionary_id;
        this.language_id = language_id;
        this.lemma = lemma;
    }

    public GetId(): number {
        return this.id;
    }

    public GetDictionaryId(): number {
        return this.dictionary_id;
    }

    public GetLanguageId(): number {
        return this.language_id;
    }
    public SetLanguageId(language_id: number) {
        this.language_id = language_id;
    }

    public GetLemma(): string {
        return this.lemma;
    }
    public SetLemma(lemma: string) {
        this.lemma = lemma;
    }

    public GetQueryObject() {
        return {
            entry_id: this.id,
            dictionary_id: this.dictionary_id,
            language_id: this.language_id,
            lemma: this.lemma,
        }
    }

    public static Hydrate(raw: any) {
        return new Entry(
            raw.id,
            raw.dictionary_id,
            raw.language_id,
            raw.lemma,
        );
    }

    public Validate() {
        if (this.dictionary_id === 0) {
            return false;
        } else if (this.language_id === 0) {
            return false;
        } else if (!this.lemma.trim()) {
            return false;
        }

        return true;
    }

    public Normalize(): void {
        this.lemma = this.lemma.charAt(0).toUpperCase() + this.lemma.slice(1);
    }
}