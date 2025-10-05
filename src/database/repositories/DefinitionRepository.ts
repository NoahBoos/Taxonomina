import {Definition} from "../models/Definition";
import {Database} from "../Database";
import {RunResult} from "better-sqlite3";

export class DefinitionRepository {
    public static ReadAll(): Definition[] {
        const statement = Database.GetDatabase().prepare(`
            SELECT *
            FROM definitions
        `);
        return statement.all() as Definition[];
    }

    public static ReadOne(id: number): Definition | undefined {
        const statement = Database.GetDatabase().prepare(`
            SELECT *
            FROM definitions
            WHERE id = @id
        `);
        return statement.get({id: id}) as Definition ?? undefined;
    }

    public static Create(definition: Definition): boolean {
        const statement = Database.GetDatabase().prepare(`
            INSERT INTO definitions (definition)
            VALUES (@definition)
        `);
        const result: RunResult = statement.run(definition.GetQueryObject());
        return result.changes > 0;
    }

    public static Update(definition: Definition): boolean {
        const statement = Database.GetDatabase().prepare(`
            UPDATE definitions
            SET definition = @definition
            WHERE id = @id
        `);
        const result: RunResult = statement.run(definition.GetQueryObject());
        return result.changes > 0;
    }

    public static Delete(definition: Definition): boolean {
        const statement = Database.GetDatabase().prepare(`
            DELETE
            FROM definitions
            WHERE id = @id
        `);
        const result: RunResult = statement.run(definition.GetQueryObject());
        return result.changes > 0;
    }
}
