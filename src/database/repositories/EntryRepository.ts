import {Entry} from "../models/Entry";
import {Database} from "../Database";
import {RunResult} from "better-sqlite3";
import {Definition} from "../models/Definition";
import {GrammaticalCategory} from "../models/GrammaticalCategory";
import {GrammaticalGenre} from "../models/GrammaticalGenre";

export class EntryRepository {
    public static ReadAll(): Entry[] {
        const statement = Database.GetDatabase().prepare(`
            SELECT *
            FROM entries
        `);
        return statement.all() as Entry[];
    }

    public static ReadAllByGlobalTranslation(entry: Entry): Entry[] {
        const statement = Database.GetDatabase().prepare(`
            SELECT entry.*
            FROM entries as entry
            JOIN entry_entry as ee
                ON (entry.id = ee.first_entry_id AND ee.second_entry_id = @entry_id)
                OR (entry.id = ee.second_entry_id AND ee.first_entry_id = @entry_id)
        `);
        return statement.all(entry.GetQueryObject()) as Entry[];
    }

    public static ReadAllByLocalTranslation(definition: Definition): Entry[] {
        const statement = Database.GetDatabase().prepare(`
            SELECT entry.*
            FROM entries AS entry
            JOIN entry_definition AS ed
                ON entry.id = ed.entry_id    
            WHERE ed.definition_id = @definition_id
        `);
        return statement.all(definition.GetQueryObject()) as Entry[];
    }

    public static ReadOne(id: number): Entry | undefined {
        const statement = Database.GetDatabase().prepare(`
            SELECT *
            FROM entries
            WHERE id = @entry_id
        `);
        return statement.get({entry_id: id}) as Entry ?? undefined;
    }

    public static BindToGrammaticalCategory(entry: Entry, category: GrammaticalCategory) {
        const statement = Database.GetDatabase().prepare(`
            INSERT INTO entry_grammatical_category (entry_id, grammatical_category_id) 
            VALUES (@entry_id, @grammatical_category_id) 
        `);
        const result: RunResult = statement.run({
            entry_id: entry.GetQueryObject().entry_id,
            grammatical_category_id: category.GetQueryObject().grammatical_category_id
        });
        return result.changes > 0;
    }

    public static UnbindFromGrammaticalCategory(entry: Entry, category: GrammaticalCategory) {
        const statement = Database.GetDatabase().prepare(`
            DELETE FROM entry_grammatical_category
            WHERE entry_id = @entry_id AND grammatical_category_id = @grammatical_category_id
        `);
        const result: RunResult = statement.run({
            entry_id: entry.GetQueryObject().entry_id,
            grammatical_category_id: category.GetQueryObject().grammatical_category_id
        });
        return result.changes > 0;
    }

    public static BindToGrammaticalGenre(entry: Entry, genre: GrammaticalGenre) {
        const statement = Database.GetDatabase().prepare(`
            INSERT INTO entry_grammatical_genre (entry_id, grammatical_genre_id)
            VALUES (@entry_id, @grammatical_genre_id)
        `);
        const result: RunResult = statement.run({
            entry_id: entry.GetQueryObject().entry_id,
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
            entry_id: entry.GetQueryObject().entry_id,
            grammatical_genre_id: genre.GetQueryObject().grammatical_genre_id
        });
        return result.changes > 0;
    }

    public static BindToTranslation(entry: Entry, translation: Entry) {
        const statement = Database.GetDatabase().prepare(`
            INSERT INTO entry_entry (first_entry_id, second_entry_id)
            VALUES (@entry_id, @translation_id)
        `);
        const result: RunResult = statement.run({
            entry_id: entry.GetQueryObject().entry_id,
            translation_id: translation.GetQueryObject().entry_id
        });
        return result.changes > 0;
    }

    public static UnbindFromTranslation(entry: Entry, translation: Entry) {
        const statement = Database.GetDatabase().prepare(`
            DELETE FROM entry_entry
            WHERE first_entry_id = @entry_id AND second_entry_id = @translation_id
        `);
        const result: RunResult = statement.run({
            entry_id: entry.GetQueryObject().entry_id,
            translation_id: translation.GetQueryObject().entry_id
        });
        return result.changes > 0;
    }

    public static Create(entry: Entry): [boolean, Entry | undefined] {
        const statement = Database.GetDatabase().prepare(`
            INSERT INTO entries (dictionary_id, language_id, lemma)
            VALUES (@dictionary_id, @language_id, @lemma)
        `);
        const result: RunResult = statement.run(entry.GetQueryObject());
        if (result.changes > 0) {
            return [true, new Entry(Number(result.lastInsertRowid), entry.GetDictionaryId(), entry.GetLanguageId(), entry.GetLemma())]
        } else return [false, undefined]
    }

    public static Update(entry: Entry): [boolean, Entry | undefined] {
        const statement = Database.GetDatabase().prepare(`
            UPDATE entries
            SET dictionary_id = @dictionary_id,
                language_id = @language_id,
                lemma = @lemma
            WHERE id = @entry_id
        `);
        const result: RunResult = statement.run(entry.GetQueryObject());
        if (result.changes > 0) {
            return [true, new Entry(entry.GetId(), entry.GetDictionaryId(), entry.GetLanguageId(), entry.GetLemma())]
        } else return [false, undefined]
    }

    public static Delete(entry: Entry): boolean {
        const statement = Database.GetDatabase().prepare(`
            DELETE
            FROM entries
            WHERE id = @entry_id
        `);
        const result: RunResult = statement.run(entry.GetQueryObject());
        return result.changes > 0;
    }
}
