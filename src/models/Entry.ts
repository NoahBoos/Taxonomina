export class Entry {
    private readonly id: number;
    private readonly dictionary_id: number;
    private language_dictionary_id: number;
    private grammatical_category_id: number;
    private lemma: string;

    constructor(id: number, dictionary_id: number, language_dictionary_id: number, grammatical_category_id: number, lemma: string) {
        this.id = id;
        this.dictionary_id = dictionary_id;
        this.language_dictionary_id = language_dictionary_id;
        this.grammatical_category_id = grammatical_category_id;
        this.lemma = lemma;
    }

    public GetId(): number {
        return this.id;
    }

    public GetDictionaryId(): number {
        return this.dictionary_id;
    }

    public GetLanguageDictionaryId(): number {
        return this.language_dictionary_id;
    }
    public SetLanguageDictionaryId(language_dictionary_id: number) {
        this.language_dictionary_id = language_dictionary_id;
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
}