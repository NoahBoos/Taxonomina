import {Entry} from "../models/Entry";
import {Database} from "../Database";
import {RunResult, Statement} from "better-sqlite3";
import {I_Entry} from "../../../shared/interfaces/I_Entry";
import { ErrorDomain, TaxonominaError } from "../../../shared/errors/types";

export class EntryRepository {
    public static readAll(dictionary_id: number): I_Entry[] {
        const statement: Statement<{ dictionary_id: number }, I_Entry> = Database.GetDatabase().prepare(`
            SELECT *
            FROM entries
            WHERE dictionary_id = @dictionary_id;
        `);

        return statement.all({"dictionary_id": dictionary_id});
    }

    public static readAllByGlobalTranslation(entry_id: number): I_Entry[] {
        const statement: Statement<{ entry_id: number }, I_Entry> = Database.GetDatabase().prepare(`
            SELECT entries.*
            FROM entries
            JOIN entry_entry 
                ON (entries.id = entry_entry.first_entry_id AND entry_entry.second_entry_id = @entry_id) 
                OR (entries.id = entry_entry.second_entry_id AND entry_entry.first_entry_id = @entry_id);
        `);

        return statement.all({ entry_id });
    }

    public static readAllByLocalTranslation(definition_id: number): I_Entry[] {
        const statement: Statement<{ definition_id: number }, I_Entry> = Database.GetDatabase().prepare(`
            SELECT entries.*
            FROM entries
            JOIN entry_definition
                ON entries.id = entry_definition.entry_id    
            WHERE entry_definition.definition_id = @definition_id;
        `);

        return statement.all({ definition_id });
    }

    public static readOne(entry_id: number): I_Entry | undefined {
        const statement: Statement<{ id: number }, I_Entry> = Database.GetDatabase().prepare(`
            SELECT *
            FROM entries
            WHERE id = @id;
        `);

        return statement.get({ id: entry_id });
    }

    public static create(entry: I_Entry): [boolean, I_Entry | undefined, TaxonominaError<ErrorDomain>[]] {
        const _entry: Entry = Entry.hydrate(entry);
        let [validation_success, errors] = _entry.validate();
        if (!validation_success) return [false, undefined, errors];

        const statement: Statement<{ dictionary_id: number, language_id: number, lemma: string }, number> = Database.GetDatabase().prepare(`
            INSERT INTO entries (dictionary_id, language_id, lemma) VALUES (@dictionary_id, @language_id, @lemma);
        `);

        const result: RunResult = statement.run({ dictionary_id: _entry.dictionary_id, language_id: _entry.language_id, lemma: _entry.lemma });

        if (result.changes > 0) {
            return [true, new Entry(Number(result.lastInsertRowid), _entry.dictionary_id, _entry.language_id, _entry.lemma).toJSON(), []];
        } else return [false, undefined, errors];
    }

    public static update(entry: I_Entry): [boolean, I_Entry | undefined, TaxonominaError<ErrorDomain>[]] {
        const _entry: Entry = Entry.hydrate(entry);
        let [validation_success, errors] = _entry.validate();
        if (!validation_success) return [false, undefined, errors];

        const statement: Statement<{ entry_id: number, dictionary_id: number, language_id: number, lemma: string }, number> = Database.GetDatabase().prepare(`
            UPDATE entries
            SET dictionary_id = @dictionary_id, language_id = @language_id, lemma = @lemma
            WHERE id = @entry_id;
        `);

        const result: RunResult = statement.run({ entry_id: _entry.id, dictionary_id: _entry.dictionary_id, language_id: _entry.language_id, lemma: _entry.lemma });

        if (result.changes > 0) {
            return [true, _entry.toJSON(), []];
        } else return [false, undefined, errors];
    }

    public static delete(entry_id: number): boolean {
        const statement: Statement<{ id: number }, number> = Database.GetDatabase().prepare(`
            DELETE FROM entries WHERE id = @id;
        `);

        const result: RunResult = statement.run({ id: entry_id });

        return result.changes > 0;
    }

    public static bindToGrammaticalClass(entry_id: number, grammatical_class_id: number): boolean {
        const statement: Statement<{ entry_id: number, grammatical_class_id: number }, number> = Database.GetDatabase().prepare(`
            INSERT INTO entry_grammatical_class (entry_id, grammatical_class_id) VALUES (@entry_id, @grammatical_class_id);
        `);

        const result: RunResult = statement.run({ entry_id, grammatical_class_id });

        return result.changes > 0;
    }

    public static unbindFromGrammaticalClass(entry_id: number, grammatical_class_id: number): boolean {
        const statement: Statement<{ entry_id: number, grammatical_class_id: number }, number> = Database.GetDatabase().prepare(`
            DELETE FROM entry_grammatical_class WHERE entry_id = @entry_id AND grammatical_class_id = @grammatical_class_id;
        `);

        const result: RunResult = statement.run({ entry_id, grammatical_class_id });

        return result.changes > 0;
    }

    public static bindToGrammaticalGenre(entry_id: number, grammatical_genre_id: number): boolean {
        const statement: Statement<{ entry_id: number, grammatical_genre_id: number }, number> = Database.GetDatabase().prepare(`
            INSERT INTO entry_grammatical_genre (entry_id, grammatical_genre_id) VALUES (@entry_id, @grammatical_genre_id);
        `);

        const result: RunResult = statement.run({ entry_id, grammatical_genre_id });

        return result.changes > 0;
    }

    public static unbindFromGrammaticalGenre(entry_id: number, grammatical_genre_id: number): boolean {
        const statement: Statement<{ entry_id: number, grammatical_genre_id: number }> = Database.GetDatabase().prepare(`
            DELETE FROM entry_grammatical_genre WHERE entry_id = @entry_id AND grammatical_genre_id = @grammatical_genre_id;
        `);

        const result: RunResult = statement.run({ entry_id, grammatical_genre_id });

        return result.changes > 0;
    }

    public static bindToTranslation(entry_id: number, translation_id: number): boolean {
        const first_entry_id: number = Math.min(entry_id, translation_id);
        const second_entry_id: number = Math.max(entry_id, translation_id);

        const statement: Statement<{ first_entry_id: number, second_entry_id: number }, number> = Database.GetDatabase().prepare(`
            INSERT INTO entry_entry (first_entry_id, second_entry_id) VALUES (@first_entry_id, @second_entry_id);
        `);

        const result: RunResult = statement.run({ first_entry_id, second_entry_id });

        return result.changes > 0;
    }

    public static unbindFromTranslation(entry_id: number, translation_id: number): boolean {
        const first_entry_id: number = Math.min(entry_id, translation_id);
        const second_entry_id: number = Math.max(entry_id, translation_id);

        const statement: Statement<{ first_entry_id: number, second_entry_id: number }, number> = Database.GetDatabase().prepare(`
            DELETE FROM entry_entry WHERE first_entry_id = @first_entry_id AND second_entry_id = @second_entry_id;
        `);

        const result: RunResult = statement.run({ first_entry_id, second_entry_id });

        return result.changes > 0;
    }
}
