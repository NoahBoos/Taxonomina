import {GrammaticalCase} from "../models/GrammaticalCase";
import {Database} from "../Database";
import {RunResult} from "better-sqlite3";

export class GrammaticalCaseRepository {
    public static ReadAll(): GrammaticalCase[] {
        const statement = Database.GetDatabase().prepare(`
            SELECT *
            FROM grammatical_cases
        `);
        return statement.all() as GrammaticalCase[];
    }

    public static ReadOne(id: number): GrammaticalCase | undefined {
        const statement = Database.GetDatabase().prepare(`
            SELECT *
            FROM grammatical_cases
            WHERE id = @id
        `);
        return statement.get({id: id}) as GrammaticalCase ?? undefined;
    }

    public static Create(gramCase: GrammaticalCase): boolean {
        const statement = Database.GetDatabase().prepare(`
            INSERT INTO grammatical_cases (name)
            VALUES (@name)
        `);
        const result: RunResult = statement.run(gramCase.GetQueryObject());
        return result.changes > 0;
    }

    public static Update(gramCase: GrammaticalCase): boolean {
        const statement = Database.GetDatabase().prepare(`
            UPDATE grammatical_cases
            SET name = @name
            WHERE id = @id
        `);
        const result: RunResult = statement.run(gramCase.GetQueryObject());
        return result.changes > 0;
    }

    public static Delete(gramCase: GrammaticalCase): boolean {
        const statement = Database.GetDatabase().prepare(`
            DELETE
            FROM grammatical_cases
            WHERE id = @id
        `);
        const result: RunResult = statement.run(gramCase.GetQueryObject());
        return result.changes > 0;
    }
}
