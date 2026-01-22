import { I_GrammaticalClass } from "../../../shared/interfaces/I_GrammaticalClass";
import { Database } from "../Database";
import { RunResult, Statement } from "better-sqlite3";
import { GrammaticalClass } from "../models/GrammaticalClass";

export class GrammaticalClassRepository {
    public static readAll(dictionary_id: number): I_GrammaticalClass[] {
        const statement: Statement<{ dictionary_id: number }, I_GrammaticalClass> = Database.GetDatabase().prepare(`
            SELECT * 
            FROM grammatical_classes 
            WHERE dictionary_id = @dictionary_id
        `);

        return statement.all({ dictionary_id });
    }

    public static readAllByEntry(entry_id: number): I_GrammaticalClass[] {
        const statement: Statement<{ entry_id: number }, I_GrammaticalClass> = Database.GetDatabase().prepare(`
            SELECT *
            FROM grammatical_classes
            JOIN entry_grammatical_class ON entry_grammatical_class.grammatical_class_id = grammatical_classes.id
            WHERE entry_grammatical_class.entry_id = @entry_id;
        `);

        return statement.all({ entry_id });
    }

    public static readOne(grammatical_class_id: number): I_GrammaticalClass | undefined {
        const statement: Statement<{ id: number }, I_GrammaticalClass> = Database.GetDatabase().prepare(`
            SELECT *
            FROM grammatical_classes
            WHERE id = @id;
        `);

        return statement.get({ id: grammatical_class_id });
    }

    public static create(grammatical_class: I_GrammaticalClass): [boolean, I_GrammaticalClass | undefined] {
        const _grammatical_class: GrammaticalClass = GrammaticalClass.hydrate(grammatical_class);
        if (!_grammatical_class.validate()) return [false, undefined];

        const statement: Statement<{ dictionary_id: number, name: string }, number> = Database.GetDatabase().prepare(`
            INSERT INTO grammatical_classes (dictionary_id, name) VALUES (@dictionary_id, @name);
        `);

        const result: RunResult = statement.run({ dictionary_id: _grammatical_class.dictionary_id, name: _grammatical_class.name });

        if (result.changes > 0) {
            return [true, new GrammaticalClass(Number(result.lastInsertRowid), _grammatical_class.dictionary_id, _grammatical_class.name).toJSON()];
        } else return [false, undefined];
    }

    public static update(grammatical_class: I_GrammaticalClass): [boolean, I_GrammaticalClass | undefined] {
        const _grammatical_class: GrammaticalClass = GrammaticalClass.hydrate(grammatical_class);
        if (!_grammatical_class.validate()) return [false, undefined];

        const statement: Statement<{ id: number, dictionary_id: number, name: string }, number> = Database.GetDatabase().prepare(`
            UPDATE grammatical_classes SET dictionary_id = @dictionary_id, name = @name
            WHERE id = @id;
        `);

        const result: RunResult = statement.run({ id: _grammatical_class.id, dictionary_id: _grammatical_class.dictionary_id, name: _grammatical_class.name });

        if (result.changes > 0) {
            return [true, _grammatical_class.toJSON()];
        } else return [false, undefined];
    }

    public static delete(grammatical_class_id: number): boolean {
        const statement: Statement<{ grammatical_class_id: number }, number> = Database.GetDatabase().prepare(`
            DELETE FROM grammatical_classes WHERE id = @grammatical_class_id;
        `)

        const result: RunResult = statement.run({ grammatical_class_id });

        return result.changes > 0;
    }
}