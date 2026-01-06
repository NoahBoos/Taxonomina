import {Inflection} from "../models/Inflection";
import {Database} from "../Database";
import {RunResult} from "better-sqlite3";
import {I_Inflection} from "../../../shared/interfaces/I_Inflection";

export class InflectionRepository {
    public static ReadAll(): I_Inflection[] {
        const statement = Database.GetDatabase().prepare(`
            SELECT *
            FROM inflections
        `);
        return statement.all() as I_Inflection[];
    }

    public static ReadOne(id: number): I_Inflection | undefined {
        const statement = Database.GetDatabase().prepare(`
            SELECT *
            FROM inflections
            WHERE id = @inflection_id
        `);
        return statement.get({inflection_id: id}) as I_Inflection ?? undefined;
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
            WHERE id = @inflection_id
        `);
        const result: RunResult = statement.run(inflection.GetQueryObject());
        return result.changes > 0;
    }

    public static Delete(inflection: Inflection): boolean {
        const statement = Database.GetDatabase().prepare(`
            DELETE
            FROM inflections
            WHERE id = @inflection_id
        `);
        const result: RunResult = statement.run(inflection.GetQueryObject());
        return result.changes > 0;
    }
}
