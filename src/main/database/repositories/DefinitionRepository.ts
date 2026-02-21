import {I_Definition} from "../../../shared/interfaces/I_Definition";
import {Database} from "../Database";
import { RunResult, Statement } from "better-sqlite3";
import { Definition } from "../models/Definition";
import { ErrorDomain, TaxonominaError } from "../../../shared/errors/types";

export class DefinitionRepository {
    public static readAll(): I_Definition[] {
        const statement: Statement<[], I_Definition> = Database.GetDatabase().prepare(`
            SELECT *
            FROM definitions;
        `);

        let definitions: I_Definition[] = statement.all();
        definitions.forEach(d => d.clientKey = `definition:${ d.id }`);
        return definitions;
    }

    public static readAllByEntry(entry_id: number): I_Definition[] {
        const statement: Statement<{ entry_id: number }, I_Definition> = Database.GetDatabase().prepare(`
            SELECT *
            FROM definitions
            JOIN entry_definition ON entry_definition.definition_id = id
            WHERE entry_definition.entry_id = @entry_id;
        `)

        let definitions: I_Definition[] = statement.all({ entry_id });
        definitions.forEach(d => d.clientKey = `definition:${ d.id }`);
        return definitions;
    }

    public static readOne(definition_id: number): I_Definition | undefined {
        const statement: Statement<{ definition_id: number }, I_Definition> = Database.GetDatabase().prepare(`
            SELECT *
            FROM definitions
            WHERE id = @definition_id;
        `)

        let definition: I_Definition | undefined = statement.get({ definition_id });
        if (definition) definition.clientKey = `definition:${ definition_id }`;
        return definition;
    }

    public static create(definition: I_Definition): [boolean, I_Definition | undefined, TaxonominaError<ErrorDomain>[]] {
        const _definition: Definition = Definition.hydrate(definition);
        let [validation_success, errors] = _definition.validate(definition.clientKey);
        if (!validation_success) return [false, undefined, errors];

        const statement: Statement<{ definition: string }, number> = Database.GetDatabase().prepare(`
            INSERT INTO definitions (definition) VALUES (@definition);
        `);

        const result: RunResult = statement.run({ definition: _definition.definition });

        if (result.changes > 0) {
            return [true, new Definition(Number(result.lastInsertRowid), _definition.definition).toJSON(), []];
        } else return [false, undefined, []];
    }

    public static update(definition: I_Definition): [boolean, I_Definition | undefined, TaxonominaError<ErrorDomain>[]] {
        const _definition: Definition = Definition.hydrate(definition);
        let [validation_success, errors] = _definition.validate(definition.clientKey);
        if (!validation_success) return [false, undefined, errors];

        const statement: Statement<{ id: number, definition: string }, number> = Database.GetDatabase().prepare(`
            UPDATE definitions SET definition = @definition
            WHERE id = @id;
        `);

        const result: RunResult = statement.run({ id: _definition.id, definition: _definition.definition });

        if (result.changes > 0) {
            return [true, _definition.toJSON(), []];
        } else return [false, undefined, []];
    }

    public static delete(definition_id: number): boolean {
        const statement: Statement<{ id: number }, number> = Database.GetDatabase().prepare(`
            DELETE FROM definitions WHERE id = @id;
        `);

        const result: RunResult = statement.run({ id: definition_id });

        return result.changes > 0;
    }

    public static bindToTranslation(definition_id: number, translation_id: number): boolean {
        const statement: Statement<{ definition_id: number, translation_id: number }, number> = Database.GetDatabase().prepare(`
            INSERT INTO entry_definition (entry_id, definition_id) VALUES (@translation_id, @definition_id);
        `);

        const result: RunResult = statement.run({ definition_id, translation_id });

        return result.changes > 0;
    }

    public static unbindFromTranslation(definition_id: number, translation_id: number): boolean {
        const statement: Statement<{ definition_id: number, translation_id: number }, number> = Database.GetDatabase().prepare(`
            DELETE FROM entry_definition WHERE definition_id = @definition_id AND entry_id = @translation_id;
        `);

        const result: RunResult = statement.run({ definition_id, translation_id });

        return result.changes > 0;
    }
}