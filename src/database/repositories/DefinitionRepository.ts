import {Definition} from "../models/Definition";
import {Database} from "../Database";
import {RunResult} from "better-sqlite3";
import {Entry} from "../models/Entry";

export class DefinitionRepository {
    public static ReadAll(): Definition[] {
        const statement = Database.GetDatabase().prepare(`
            SELECT *
            FROM definitions
        `);
        return statement.all() as Definition[];
    }

    public static ReadAllByEntry(entry: Entry): Definition[] {
        const statement = Database.GetDatabase().prepare(`
            SELECT definition.*
            FROM definitions as definition
             JOIN entry_definition
                  ON entry_definition.definition_id = definition.id
            WHERE entry_definition.entry_id = @entry_id
        `);
        return statement.all(entry.GetQueryObject()) as Definition[];
    }

    public static ReadOne(id: number): Definition | undefined {
        const statement = Database.GetDatabase().prepare(`
            SELECT *
            FROM definitions
            WHERE id = @definition_id
        `);
        return statement.get({definition_id: id}) as Definition ?? undefined;
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
            WHERE id = @definition_id
        `);
        const result: RunResult = statement.run(definition.GetQueryObject());
        return result.changes > 0;
    }

    public static Delete(definition: Definition): boolean {
        const statement = Database.GetDatabase().prepare(`
            DELETE
            FROM definitions
            WHERE id = @definition_id
        `);
        const result: RunResult = statement.run(definition.GetQueryObject());
        return result.changes > 0;
    }
}
