import {Entry} from "../models/Entry";
import {Database} from "../Database";
import {RunResult} from "better-sqlite3";
import {Definition} from "../models/Definition";
import {GrammaticalClass} from "../models/GrammaticalClass";
import {GrammaticalGenre} from "../models/GrammaticalGenre";
import {I_Entry} from "../../../shared/interfaces/I_Entry";

export class EntryRepository {
    public static ReadAll(dictionary_id: number): I_Entry[] {
        const statement = Database.GetDatabase().prepare(`
            SELECT *
            FROM entries
            WHERE dictionary_id = @dictionary_id
        `);
        return statement.all({"dictionary_id": dictionary_id}) as I_Entry[];
    }

    public static ReadAllByGlobalTranslation(entry: Entry): I_Entry[] {
        const statement = Database.GetDatabase().prepare(`
            SELECT entry.*
            FROM entries as entry
            JOIN entry_entry as ee
                ON (entry.id = ee.first_entry_id AND ee.second_entry_id = @entry_id)
                OR (entry.id = ee.second_entry_id AND ee.first_entry_id = @entry_id)
        `);
        return statement.all(entry.toDatabaseObject()) as I_Entry[];
    }

    public static ReadAllByLocalTranslation(definition: Definition): I_Entry[] {
        const statement = Database.GetDatabase().prepare(`
            SELECT entry.*
            FROM entries AS entry
            JOIN entry_definition AS ed
                ON entry.id = ed.entry_id    
            WHERE ed.definition_id = @definition_id
        `);
        return statement.all(definition.toDatabaseObject()) as I_Entry[];
    }

    public static ReadOne(id: number): I_Entry | undefined {
        const statement = Database.GetDatabase().prepare(`
            SELECT *
            FROM entries
            WHERE id = @entry_id
        `);
        return statement.get({entry_id: id}) as I_Entry ?? undefined;
    }

    public static BindToGrammaticalClass(entry: Entry, grammaticalClass: GrammaticalClass) {
        const statement = Database.GetDatabase().prepare(`
            INSERT INTO entry_grammatical_class (entry_id, grammatical_class_id) 
            VALUES (@entry_id, @grammatical_class_id) 
        `);
        const result: RunResult = statement.run({
            entry_id: entry.toDatabaseObject().entry_id,
            grammatical_class_id: grammaticalClass.toDatabaseObject().grammatical_class_id
        });
        return result.changes > 0;
    }

    public static UnbindFromGrammaticalClass(entry: Entry, grammaticalClass: GrammaticalClass) {
        const statement = Database.GetDatabase().prepare(`
            DELETE FROM entry_grammatical_class
            WHERE entry_id = @entry_id AND grammatical_class_id = @grammatical_class_id
        `);
        const result: RunResult = statement.run({
            entry_id: entry.toDatabaseObject().entry_id,
            grammatical_class_id: grammaticalClass.toDatabaseObject().grammatical_class_id
        });
        return result.changes > 0;
    }

    public static BindToGrammaticalGenre(entry: Entry, genre: GrammaticalGenre) {
        const statement = Database.GetDatabase().prepare(`
            INSERT INTO entry_grammatical_genre (entry_id, grammatical_genre_id)
            VALUES (@entry_id, @grammatical_genre_id)
        `);
        const result: RunResult = statement.run({
            entry_id: entry.toDatabaseObject().entry_id,
            grammatical_genre_id: genre.GetQueryObject().grammatical_genre_id
        });
        return result.changes > 0;
    }

    public static UnbindFromGrammaticalGenre(entry: Entry, genre: GrammaticalGenre) {
        const statement = Database.GetDatabase().prepare(`
            DELETE FROM entry_grammatical_genre
            WHERE entry_id = @entry_id AND grammatical_genre_id = @grammatical_genre_id
        `);
        const result: RunResult = statement.run({
            entry_id: entry.toDatabaseObject().entry_id,
            grammatical_genre_id: genre.GetQueryObject().grammatical_genre_id
        });
        return result.changes > 0;
    }

    public static BindToTranslation(entry: Entry, translation: Entry) {
        const first_entry_id: number = Math.min(entry.toDatabaseObject().entry_id, translation.toDatabaseObject().entry_id);
        const second_entry_id: number = Math.max(entry.toDatabaseObject().entry_id, translation.toDatabaseObject().entry_id);
        const statement = Database.GetDatabase().prepare(`
            INSERT INTO entry_entry (first_entry_id, second_entry_id)
            VALUES (@first_entry_id, @second_entry_id)
        `);
        const result: RunResult = statement.run({
            first_entry_id: first_entry_id,
            second_entry_id: second_entry_id
        });
        return result.changes > 0;
    }

    public static UnbindFromTranslation(entry: Entry, translation: Entry) {
        const first_entry_id: number = Math.min(entry.toDatabaseObject().entry_id, translation.toDatabaseObject().entry_id);
        const second_entry_id: number = Math.max(entry.toDatabaseObject().entry_id, translation.toDatabaseObject().entry_id);
        const statement = Database.GetDatabase().prepare(`
            DELETE FROM entry_entry
            WHERE first_entry_id = @first_entry_id AND second_entry_id = @second_entry_id
        `);
        const result: RunResult = statement.run({
            first_entry_id: first_entry_id,
            second_entry_id: second_entry_id
        });
        return result.changes > 0;
    }

    public static Create(entry: Entry): [boolean, I_Entry | undefined] {
        const statement = Database.GetDatabase().prepare(`
            INSERT INTO entries (dictionary_id, language_id, lemma)
            VALUES (@dictionary_id, @language_id, @lemma)
        `);
        const result: RunResult = statement.run(entry.toDatabaseObject());
        if (result.changes > 0) {
            return [true, new Entry(Number(result.lastInsertRowid), entry.dictionary_id, entry.language_id, entry.lemma).toJSON()]
        } else return [false, undefined]
    }

    public static Update(entry: Entry): [boolean, I_Entry | undefined] {
        const statement = Database.GetDatabase().prepare(`
            UPDATE entries
            SET dictionary_id = @dictionary_id,
                language_id = @language_id,
                lemma = @lemma
            WHERE id = @entry_id
        `);
        const result: RunResult = statement.run(entry.toDatabaseObject());
        if (result.changes > 0) {
            return [true, new Entry(entry.id, entry.dictionary_id, entry.language_id, entry.lemma).toJSON()]
        } else return [false, undefined]
    }

    public static Delete(entry: Entry): boolean {
        const statement = Database.GetDatabase().prepare(`
            DELETE
            FROM entries
            WHERE id = @entry_id
        `);
        const result: RunResult = statement.run(entry.toDatabaseObject());
        return result.changes > 0;
    }
}
