import {Dictionary} from "../models/Dictionary";
import {Database} from "../Database";
import {RunResult} from "better-sqlite3";
import {I_Dictionary} from "../../../shared/interfaces/I_Dictionary";

export class DictionaryRepository {
    public static ReadAll(): I_Dictionary[] {
        const statement = Database.GetDatabase().prepare(`
            SELECT * 
            FROM dictionaries
        `);
        return statement.all() as I_Dictionary[];
    }

    public static ReadAllButOne(dictionaryToIgnore: Dictionary): I_Dictionary[] {
        const statement = Database.GetDatabase().prepare(`
            SELECT *
            FROM dictionaries
            WHERE id != @dictionary_id
        `);
        return statement.all(dictionaryToIgnore.toDatabaseObject()) as I_Dictionary[];
    }

    public static ReadOne(id: number): I_Dictionary | undefined {
        const statement = Database.GetDatabase().prepare(`
            SELECT *
            FROM dictionaries
            WHERE id = @dictionary_id
        `);
        return statement.get({dictionary_id: id}) as I_Dictionary ?? undefined;
    }

    public static Create(dictionary: Dictionary): [boolean, I_Dictionary | undefined] {
        const statement = Database.GetDatabase().prepare(`
           INSERT INTO dictionaries (name, description)
           VALUES (@name, @description)
        `);
        const result: RunResult = statement.run(dictionary.toDatabaseObject());
        if (result.changes > 0) {
            return [true, new Dictionary(Number(result.lastInsertRowid), dictionary.name, dictionary.description).toJSON()];
        } else return [false, undefined];
    }

    public static Update(dictionary: Dictionary): [boolean, I_Dictionary | undefined] {
        const statement = Database.GetDatabase().prepare(`
            UPDATE dictionaries
            SET name = @name, 
                description = @description
            WHERE id = @dictionary_id
        `);
        const result: RunResult = statement.run(dictionary.toDatabaseObject());
        if (result.changes > 0) {
            return [true, new Dictionary(dictionary.id, dictionary.name, dictionary.description).toJSON()];
        } else return [false, undefined];
    }

    public static Delete(dictionary: Dictionary): boolean {
        const statement = Database.GetDatabase().prepare(`
            DELETE 
            FROM dictionaries
            WHERE id = @dictionary_id
        `);
        const result: RunResult = statement.run(dictionary.toDatabaseObject());
        return result.changes > 0;
    }
}