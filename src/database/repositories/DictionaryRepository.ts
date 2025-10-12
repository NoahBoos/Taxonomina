import {Dictionary} from "../models/Dictionary";
import {Database} from "../Database";
import {RunResult} from "better-sqlite3";

export class DictionaryRepository {
    public static ReadAll(): Dictionary[] {
        const statement = Database.GetDatabase().prepare(`
            SELECT * 
            FROM dictionaries
        `);
        return statement.all() as Dictionary[];
    }

    public static ReadAllButOne(dictionaryToIgnore: Dictionary): Dictionary[] {
        const statement = Database.GetDatabase().prepare(`
            SELECT *
            FROM dictionaries
            WHERE id != @id
        `);
        return statement.all(dictionaryToIgnore.GetQueryObject()) as Dictionary[];
    }

    public static ReadOne(id: number): Dictionary | undefined {
        const statement = Database.GetDatabase().prepare(`
            SELECT *
            FROM dictionaries
            WHERE id = @id
        `);
        return statement.get({id: id}) as Dictionary ?? undefined;
    }

    public static Create(dictionary: Dictionary): boolean {
        const statement = Database.GetDatabase().prepare(`
           INSERT INTO dictionaries (name, description)
           VALUES (@name, @description)
        `);
        const result: RunResult = statement.run(dictionary.GetQueryObject());
        return result.changes > 0;
    }

    public static Update(dictionary: Dictionary): boolean {
        const statement = Database.GetDatabase().prepare(`
            UPDATE dictionaries
            SET name = @name, 
                description = @description
            WHERE id = @id
        `);
        const result: RunResult = statement.run(dictionary.GetQueryObject());
        return result.changes > 0;
    }

    public static Delete(dictionary: Dictionary): boolean {
        const statement = Database.GetDatabase().prepare(`
            DELETE 
            FROM dictionaries
            WHERE id = @id
        `);
        const result: RunResult = statement.run(dictionary.GetQueryObject());
        return result.changes > 0;
    }
}