import {Inflection} from "../models/Inflection";
import {Database} from "../Database";
import {RunResult} from "better-sqlite3";

export class InflectionRepository {
    public static ReadAll(): Inflection[] {
        const statement = Database.GetDatabase().prepare(`
            SELECT *
            FROM inflections
        `);
        return statement.all() as Inflection[];
    }

    public static ReadOne(id: number): Inflection | undefined {
        const statement = Database.GetDatabase().prepare(`
            SELECT *
            FROM inflections
            WHERE id = @id
        `);
        return statement.get({id: id}) as Inflection ?? undefined;
    }

    public static Create(inflection: Inflection): boolean {
        const statement = Database.GetDatabase().prepare(`
            INSERT INTO inflections (entry_id, inflection)
            VALUES (@entry_id, @inflection)
        `);
        const result: RunResult = statement.run(inflection.GetQueryObject());
        return result.changes > 0;
    }

    public static Update(inflection: Inflection): boolean {
        const statement = Database.GetDatabase().prepare(`
            UPDATE inflections
            SET entry_id = @entry_id,
                inflection = @inflection
            WHERE id = @id
        `);
        const result: RunResult = statement.run(inflection.GetQueryObject());
        return result.changes > 0;
    }

    public static Delete(inflection: Inflection): boolean {
        const statement = Database.GetDatabase().prepare(`
            DELETE
            FROM inflections
            WHERE id = @id
        `);
        const result: RunResult = statement.run(inflection.GetQueryObject());
        return result.changes > 0;
    }
}
