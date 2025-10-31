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

    public static BindToTranslation(definition: Definition, translation: Entry) {
        const statement = Database.GetDatabase().prepare(`
            INSERT INTO entry_definition (entry_id, definition_id)
            VALUES (@translation_id, @definition_id)
        `);
        const result: RunResult = statement.run({
            definition_id: definition.GetQueryObject().definition_id,
            translation_id: translation.GetQueryObject().entry_id
        });
        return result.changes > 0;
    }

    public static UnbindFromTranslation(definition: Definition, translation: Entry) {
        const statement = Database.GetDatabase().prepare(`
            DELETE FROM entry_definition
            WHERE definition_id = @definition_id AND entry_id = @translation_id
        `);
        const result: RunResult = statement.run({
            definition_id: definition.GetQueryObject().definition_id,
            translation_id: translation.GetQueryObject().entry_id
        });
        return result.changes > 0;
    }

    public static Create(definition: Definition): [boolean, Definition | undefined] {
        const statement = Database.GetDatabase().prepare(`
            INSERT INTO definitions (definition)
            VALUES (@definition)
        `);
        const result: RunResult = statement.run(definition.GetQueryObject());
        if (result.changes > 0) {
            return [true, new Definition(Number(result.lastInsertRowid), definition.GetDefinition())];
        } else return [false, undefined];
    }

    public static Update(definition: Definition): [boolean, Definition | undefined] {
        const statement = Database.GetDatabase().prepare(`
            UPDATE definitions
            SET definition = @definition
            WHERE id = @definition_id
        `);
        const result: RunResult = statement.run(definition.GetQueryObject());
        if (result.changes > 0) {
            return [true, new Definition(definition.GetId(), definition.GetDefinition())];
        } else return [false, undefined];
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
