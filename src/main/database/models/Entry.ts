import {I_Entry} from "../../../shared/interfaces/I_Entry";

export class Entry {
    constructor(
        public readonly id: number,
        public readonly dictionary_id: number,
        public language_id: number,
        private _lemma: string
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
            lemma: this.lemma
        }
    }

    public toDatabaseObject() {
        return {
            entry_id: this.id,
            dictionary_id: this.dictionary_id,
            language_id: this.language_id,
            lemma: this.lemma,
        }
    }

    public static hydrate(raw: I_Entry) {
        return new Entry(
            raw.id,
            raw.dictionary_id,
            raw.language_id,
            raw.lemma,
        );
    }

    public validate() {
        if (this.dictionary_id === 0) {
            console.warn("Une entrée ne peut pas appartenir à aucun dictionnaire.");
            return false;
        } else if (this.language_id === 0) {
            console.warn("Une entrée ne peut pas appartenir à aucune langue.");
            return false;
        } else if (this.lemma.length === 0) {
            console.warn("Le lemme d'une entrée ne peut pas être vide.");
            return false;
        }

        return true;
    }
}