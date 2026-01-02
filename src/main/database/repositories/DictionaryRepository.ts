import {Dictionary} from "../../../shared/models/Dictionary";
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
            WHERE id != @dictionary_id
        `);
        return statement.all(dictionaryToIgnore.GetQueryObject()) as Dictionary[];
    }

    public static ReadOne(id: number): Dictionary | undefined {
        const statement = Database.GetDatabase().prepare(`
            SELECT *
            FROM dictionaries
            WHERE id = @dictionary_id
        `);
        return statement.get({dictionary_id: id}) as Dictionary ?? undefined;
    }

    public static Create(dictionary: Dictionary): [boolean, Dictionary | undefined] {
        const statement = Database.GetDatabase().prepare(`
           INSERT INTO dictionaries (name, description)
           VALUES (@name, @description)
        `);
        const result: RunResult = statement.run(dictionary.GetQueryObject());
        if (result.changes > 0) {
            return [true, new Dictionary(Number(result.lastInsertRowid), dictionary.GetName(), dictionary.GetDescription())];
        } else return [false, undefined];
    }

    public static Update(dictionary: Dictionary): [boolean, Dictionary | undefined] {
        const statement = Database.GetDatabase().prepare(`
            UPDATE dictionaries
            SET name = @name, 
                description = @description
            WHERE id = @dictionary_id
        `);
        const result: RunResult = statement.run(dictionary.GetQueryObject());
        if (result.changes > 0) {
            return [true, new Dictionary(dictionary.GetId(), dictionary.GetName(), dictionary.GetDescription())];
        } else return [false, undefined];
    }

    public static Delete(dictionary: Dictionary): boolean {
        const statement = Database.GetDatabase().prepare(`
            DELETE 
            FROM dictionaries
            WHERE id = @dictionary_id
        `);
        const result: RunResult = statement.run(dictionary.GetQueryObject());
        return result.changes > 0;
    }
}