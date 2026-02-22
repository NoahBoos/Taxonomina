import { RunResult, Statement } from "better-sqlite3";
import { I_Dictionary } from "../../../shared/interfaces/I_Dictionary";
import { Database } from "../Database";
import { Dictionary } from "../models/Dictionary";
import { ErrorDomain, TaxonominaError } from "../../../shared/errors/types";

export class DictionaryRepository {
    public static readAll(): I_Dictionary[] {
        const statement: Statement<[], I_Dictionary> = Database.GetDatabase().prepare(`
            SELECT * 
            FROM dictionaries;
        `);

        return statement.all();
    }

    public static readOne(dictionary_id: number): I_Dictionary | undefined {
        const statement: Statement<{ dictionary_id: number }, I_Dictionary> = Database.GetDatabase().prepare(`
            SELECT * 
            FROM dictionaries 
            WHERE id = @dictionary_id;
        `);

        return statement.get({ dictionary_id });
    }

    public static create(dictionary: I_Dictionary): [boolean, I_Dictionary | undefined, TaxonominaError<ErrorDomain>[]] {
        const _dictionary: Dictionary = Dictionary.hydrate(dictionary);
        let [validation_success, errors] = _dictionary.validate();
        if (!validation_success) return [false, undefined, errors];

        const statement: Statement<{ name: string, description: string }, number> = Database.GetDatabase().prepare(`
            INSERT INTO dictionaries (name, description) VALUES (@name, @description);
        `);

        const result: RunResult = statement.run({ name: _dictionary.name, description: _dictionary.description });

        if (result.changes > 0) {
            return [true, new Dictionary(Number(result.lastInsertRowid), _dictionary.name, _dictionary.description).toJSON(), []];
        } else return [false, undefined, errors];
    }

    public static update(dictionary: I_Dictionary): [boolean, I_Dictionary | undefined, TaxonominaError<ErrorDomain>[]] {
        const _dictionary: Dictionary = Dictionary.hydrate(dictionary);
        let [validation_success, errors] = _dictionary.validate();
        if (!validation_success) return [false, undefined, errors];

        const statement: Statement<{ id: number, name: string, description: string }, number> = Database.GetDatabase().prepare(`
            UPDATE dictionaries 
            SET name = @name, description = @description
            WHERE id = @id;
        `);

        const result: RunResult = statement.run({ id: _dictionary.id, name: _dictionary.name, description: _dictionary.description });

        if (result.changes > 0) {
            return [true, _dictionary.toJSON(), []];
        } else return [false, undefined, errors];
    }

    public static delete(dictionary_id: number): boolean {
        const statement: Statement<{ id: number }, number> = Database.GetDatabase().prepare(`
            DELETE FROM dictionaries WHERE id = @id;
        `);

        const result: RunResult = statement.run({ id: dictionary_id });

        return result.changes > 0;
    }
}