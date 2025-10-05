export class Entry {
    private readonly id: number;
    private readonly dictionary_id: number;
    private language_id: number;
    private grammatical_category_id: number;
    private lemma: string;

    constructor(id: number, dictionary_id: number, language_id: number, grammatical_category_id: number, lemma: string) {
        this.id = id;
        this.dictionary_id = dictionary_id;
        this.language_id = language_id;
        this.grammatical_category_id = grammatical_category_id;
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

    public GetGrammaticalCategoryId(): number {
        return this.grammatical_category_id;
    }
    public SetGrammaticalCategoryId(grammatical_category_id: number) {
        this.grammatical_category_id = grammatical_category_id;
    }

    public GetLemma(): string {
        return this.lemma;
    }
    public SetLemma(lemma: string) {
        this.lemma = lemma;
    }

    public GetQueryObject() {
        return {
            id: this.id,
            dictionary_id: this.dictionary_id,
            language_id: this.language_id,
            grammatical_category_id: this.grammatical_category_id,
            lemma: this.lemma,
        }
    }
}