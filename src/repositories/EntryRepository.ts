import {Entry} from "../models/Entry";
import {Database} from "../database/Database";
import {RunResult} from "better-sqlite3";

export class EntryRepository {
    public static ReadAll(): Entry[] {
        const statement = Database.GetDatabase().prepare(`
            SELECT *
            FROM entries
        `);
        return statement.all() as Entry[];
    }

    public static ReadOne(id: number): Entry | undefined {
        const statement = Database.GetDatabase().prepare(`
            SELECT *
            FROM entries
            WHERE id = @id
        `);
        return statement.get({id: id}) as Entry ?? undefined;
    }

    public static Create(entry: Entry): boolean {
        const statement = Database.GetDatabase().prepare(`
            INSERT INTO entries (dictionary_id, language_id, grammatical_category_id, lemma)
            VALUES (@dictionary_id, @language_id, @grammatical_category_id, @lemma)
        `);
        const result: RunResult = statement.run(entry.GetQueryObject());
        return result.changes > 0;
    }

    public static Update(entry: Entry): boolean {
        const statement = Database.GetDatabase().prepare(`
            UPDATE entries
            SET dictionary_id = @dictionary_id,
                language_id = @language_id,
                grammatical_category_id = @grammatical_category_id,
                lemma = @lemma
            WHERE id = @id
        `);
        const result: RunResult = statement.run(entry.GetQueryObject());
        return result.changes > 0;
    }

    public static Delete(entry: Entry): boolean {
        const statement = Database.GetDatabase().prepare(`
            DELETE
            FROM entries
            WHERE id = @id
        `);
        const result: RunResult = statement.run(entry.GetQueryObject());
        return result.changes > 0;
    }
}
