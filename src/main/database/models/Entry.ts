import {I_Entry} from "../../../shared/interfaces/I_Entry";
import { ErrorDomain, TaxonominaError } from "../../../shared/errors/types";
import { ENTRY_ERROR_REGISTRY } from "../../../shared/errors/registries/entryErrorRegistry";
import { Language } from "./Language";
import { Definition } from "./Definition";
import { GrammaticalClass } from "./GrammaticalClass";
import { GrammaticalGenre } from "./GrammaticalGenre";

export class Entry {
    constructor(
        public readonly id: number,
        public readonly dictionary_id: number,
        public language_id: number,
        private _lemma: string,
        public language: Language | undefined = undefined,
        public grammatical_classes: GrammaticalClass[] | undefined = undefined,
        public grammatical_genres: GrammaticalGenre [] | undefined = undefined,
        public translations: Entry[] | undefined = undefined,
        public definitions: Definition[] | undefined = undefined,
    ) {
        this.lemma = _lemma;
    }

    public get lemma(): string {
        return this._lemma;
    }

    public set lemma(value: string) {
        this._lemma = value.trim().charAt(0).toUpperCase() + value.trim().slice(1);
    }

    public toJSON(): I_Entry {
        return {
            id: this.id,
            dictionary_id: this.dictionary_id,
            language_id: this.language_id,
            lemma: this.lemma,
            language: this.language?.toJSON(),
            grammatical_classes: this.grammatical_classes?.map(gc => gc.toJSON()),
            grammatical_genres: this.grammatical_genres?.map(gg => gg.toJSON()),
            translations: this.translations?.map(t => t.toJSON()),
            definitions: this.definitions?.map(d => d.toJSON()),
        }
    }

    public static hydrate(raw: I_Entry): Entry {
        return new Entry(
            raw.id,
            raw.dictionary_id,
            raw.language_id,
            raw.lemma,
            raw.language ? Language.hydrate(raw.language) : undefined,
            raw.grammatical_classes ? raw.grammatical_classes.map(gc => GrammaticalClass.hydrate(gc)) : undefined,
            raw.grammatical_genres ? raw.grammatical_genres.map(gg => GrammaticalGenre.hydrate(gg)) : undefined,
            raw.translations ? raw.translations.map(t => Entry.hydrate(t)) : undefined,
            raw.definitions ? raw.definitions.map(d => Definition.hydrate(d)) : undefined
        );
    }

    public validate(): [boolean, TaxonominaError<ErrorDomain>[]] {
        let errors: TaxonominaError<ErrorDomain>[] = [];

        if (this.dictionary_id === 0) {
            errors.push(ENTRY_ERROR_REGISTRY.E0301);
        }
        if (this.language_id === 0) {
            errors.push(ENTRY_ERROR_REGISTRY.E0303);
        }
        if (this.lemma.length === 0) {
            errors.push(ENTRY_ERROR_REGISTRY.E0302);
        }

        return [errors.length === 0, errors];
    }
}