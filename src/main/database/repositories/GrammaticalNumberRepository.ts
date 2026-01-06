import {GrammaticalNumber} from "../models/GrammaticalNumber";
import {Database} from "../Database";
import {RunResult} from "better-sqlite3";
import {I_GrammaticalNumber} from "../../../shared/interfaces/I_GrammaticalNumber";

export class GrammaticalNumberRepository {
    public static ReadAll(): I_GrammaticalNumber[] {
        const statement = Database.GetDatabase().prepare(`
            SELECT *
            FROM grammatical_numbers
        `);
        return statement.all() as I_GrammaticalNumber[];
    }

    public static ReadOne(id: number): I_GrammaticalNumber | undefined {
        const statement = Database.GetDatabase().prepare(`
            SELECT *
            FROM grammatical_numbers
            WHERE id = @grammatical_number_id
        `);
        return statement.get() as I_GrammaticalNumber;
    }

    public static Create(number: GrammaticalNumber): boolean {
        const statement = Database.GetDatabase().prepare(`
            INSERT INTO grammatical_numbers (name)
            VALUES (@name)
        `);
        const result: RunResult = statement.run(number.GetQueryObject());
        return result.changes > 0;
    }

    public static Update(number: GrammaticalNumber): boolean {
        const statement = Database.GetDatabase().prepare(`
            UPDATE grammatical_numbers
            SET name = @name
            WHERE id = @grammatical_number_id
        `);
        const result: RunResult = statement.run(number.GetQueryObject());
        return result.changes > 0;
    }

    public static Delete(number: GrammaticalNumber): boolean {
        const statement = Database.GetDatabase().prepare(`
            DELETE
            FROM grammatical_numbers
            WHERE id = @grammatical_number_id
        `);
        const result: RunResult = statement.run(number.GetQueryObject());
        return result.changes > 0;
    }
}
