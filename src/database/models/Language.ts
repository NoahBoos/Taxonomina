export class Language {
    private readonly id: number;
    private iso_639_1: string;
    private iso_639_3: string;
    private is_conlang: boolean;
    private name_native: string;
    private name_local: string;
    private direction: string;

    constructor(id: number, iso_639_1: string, iso_639_3: string, is_conlang: boolean, name_native: string, name_local: string, direction: string) {
        this.id = id;
        this.iso_639_1 = iso_639_1;
        this.iso_639_3 = iso_639_3;
        this.is_conlang = is_conlang;
        this.name_native = name_native;
        this.name_local = name_local;
        this.direction = direction;
    }

    public GetId(): number {
        return this.id;
    }

    public GetIso639_1(): string {
        return this.iso_639_1;
    }
    public SetIso639_1(iso_639_1: string) {
        this.iso_639_1 = iso_639_1;
    }

    public GetIso639_3(): string {
        return this.iso_639_3;
    }
    public SetIso639_3(iso_639_3: string) {
        this.iso_639_3 = iso_639_3;
    }

    public GetIsConlang(): boolean {
        return this.is_conlang;
    }
    public SetIsConlang(is_conlang: boolean) {
        this.is_conlang = is_conlang;
    }

    public GetNameNative(): string {
        return this.name_native;
    }
    public SetNameNative(name_native: string) {
        this.name_native = name_native;
    }

    public GetNameLocal(): string {
        return this.name_local;
    }
    public SetNameLocal(name_local: string) {
        this.name_local = name_local;
    }

    public GetDirection(): string {
        return this.direction;
    }
    public SetDirection(direction: string) {
        this.direction = direction;
    }

    public GetQueryObject() {
        return {
            language_id: this.id,
            iso_639_1: this.iso_639_1,
            iso_639_3: this.iso_639_3,
            is_conlang: this.is_conlang ? 1 : 0,
            name_native: this.name_native,
            name_local: this.name_local,
            direction: this.direction,
        }
    }

    public static Hydrate(raw: any): Language {
        return new Language(
            raw.id,
            raw.iso_639_1,
            raw.iso_639_3,
            raw.is_conlang,
            raw.name_native,
            raw.name_local,
            raw.direction
        );
    }
}