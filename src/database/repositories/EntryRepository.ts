import {Entry} from "../models/Entry";
import {Database} from "../Database";
import {RunResult} from "better-sqlite3";
import {Definition} from "../models/Definition";

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

    public static Create(entry: Entry): boolean {
        const statement = Database.GetDatabase().prepare(`
            INSERT INTO entries (dictionary_id, language_id, lemma)
            VALUES (@dictionary_id, @language_id, @lemma)
        `);
        const result: RunResult = statement.run(entry.GetQueryObject());
        return result.changes > 0;
    }

    public static Update(entry: Entry): boolean {
        const statement = Database.GetDatabase().prepare(`
            UPDATE entries
            SET dictionary_id = @dictionary_id,
                language_id = @language_id,
                lemma = @lemma
            WHERE id = @entry_id
        `);
        const result: RunResult = statement.run(entry.GetQueryObject());
        return result.changes > 0;
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
