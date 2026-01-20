import {GrammaticalClass} from "../models/GrammaticalClass";
import {Database} from "../Database";
import {RunResult} from "better-sqlite3";
import {Entry} from "../models/Entry";
import {Dictionary} from "../models/Dictionary";
import {I_GrammaticalClass} from "../../../shared/interfaces/I_GrammaticalClass";

export class GrammaticalClassRepository {
    public static ReadAll(dictionary_id: number): I_GrammaticalClass[] {
        const statement = Database.GetDatabase().prepare(`
            SELECT *
            FROM grammatical_classes
            WHERE dictionary_id = @dictionary_id
        `);
        return statement.all({"dictionary_id": dictionary_id}) as I_GrammaticalClass[];
    }

    public static ReadAllByEntry(entry: Entry): I_GrammaticalClass[] {
        const statement = Database.GetDatabase().prepare(`
            SELECT gramCat.*
            FROM grammatical_classes AS gramCat
            JOIN entry_grammatical_class AS entry_gramCat
                ON gramCat.id = entry_gramCat.grammatical_class_id
            WHERE entry_gramCat.entry_id = @entry_id
        `);
        return statement.all(entry.toDatabaseObject()) as I_GrammaticalClass[];
    }

    public static ReadOne(id: number): I_GrammaticalClass | undefined {
        const statement = Database.GetDatabase().prepare(`
            SELECT *
            FROM grammatical_classes
            WHERE id = @grammatical_class_id
        `);
        return statement.get({grammatical_class_id: id}) as I_GrammaticalClass ?? undefined;
    }

    public static Create(grammaticalClass: GrammaticalClass): [boolean, I_GrammaticalClass | undefined] {
        const statement = Database.GetDatabase().prepare(`
            INSERT INTO grammatical_classes (dictionary_id, name)
            VALUES (@dictionary_id, @name)
        `);
        const result: RunResult = statement.run(grammaticalClass.toDatabaseObject());
        if (result.changes > 0) {
            return [true, new GrammaticalClass(Number(result.lastInsertRowid), grammaticalClass.id, grammaticalClass.name).toJSON()];
        } else return [false, undefined];
    }

    public static Update(grammaticalClass: GrammaticalClass): [boolean, I_GrammaticalClass | undefined] {
        const statement = Database.GetDatabase().prepare(`
            UPDATE grammatical_classes
            SET name = @name
            WHERE id = @grammatical_class_id
        `);
        const result: RunResult = statement.run(grammaticalClass.toDatabaseObject());
        if (result.changes > 0) {
            return [true, new GrammaticalClass(Number(result.lastInsertRowid), grammaticalClass.id, grammaticalClass.name).toJSON()];
        } else return [false, undefined];
    }

    public static Delete(grammaticalClass: GrammaticalClass): boolean {
        const statement = Database.GetDatabase().prepare(`
            DELETE
            FROM grammatical_classes
            WHERE id = @grammatical_class_id
        `);
        const result: RunResult = statement.run(grammaticalClass.toDatabaseObject());
        return result.changes > 0;
    }
}
