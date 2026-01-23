import {Language} from "../models/Language";
import {Database} from "../Database";
import {RunResult, Statement} from "better-sqlite3";
import {I_Language} from "../../../shared/interfaces/I_Language";

export class LanguageRepository {
    public static readAll(dictionary_id: number): I_Language[] {
        const statement: Statement<{ id: number }, I_Language> = Database.GetDatabase().prepare(`
            SELECT *
            FROM languages
            WHERE dictionary_id = @id;
        `);

        return statement.all({ id: dictionary_id });
    }

    public static readOne(language_id: number): I_Language | undefined {
        const statement: Statement<{ id: number }, I_Language> = Database.GetDatabase().prepare(`
            SELECT *
            FROM languages
            WHERE id = @id;
        `);

        return statement.get({ id: language_id });
    }

    public static create(language: I_Language): [boolean, I_Language | undefined] {
        const _language: Language = Language.hydrate(language);
        if (!_language.validate()) return [false, undefined];

        const statement: Statement<{ dictionary_id: number, iso_639_1: string, iso_639_3: string, is_conlang: number, name_native: string, name_local: string, direction: string }, number> = Database.GetDatabase().prepare(`
            INSERT INTO languages (dictionary_id, iso_639_1, iso_639_3, is_conlang, name_native, name_local, direction)
            values (@dictionary_id, @iso_639_1, @iso_639_3, @is_conlang, @name_native, @name_local, @direction);
        `);

        const result: RunResult = statement.run({ dictionary_id: _language.dictionary_id, iso_639_1: _language.iso_639_1, iso_639_3: _language.iso_639_3, is_conlang: _language.is_conlang ? 1 : 0, name_native: _language.name_native, name_local: _language.name_local, direction: _language.direction });

        if (result.changes > 0) {
            return [true, new Language(Number(result.lastInsertRowid), language.dictionary_id, language.iso_639_1, language.iso_639_3, language.is_conlang, language.name_native, language.name_local, language.direction).toJSON()];
        } else return [false, undefined];
    }

    public static update(language: I_Language): [boolean, I_Language | undefined] {
        const _language: Language = Language.hydrate(language);
        if (!_language.validate()) return [false, undefined];

        const statement: Statement<{ id: number, dictionary_id: number, iso_639_1: string, iso_639_3: string, is_conlang: number, name_native: string, name_local: string, direction: string }, number> = Database.GetDatabase().prepare(`
            UPDATE languages
            SET dictionary_id = @dictionary_id, iso_639_1 = @iso_639_1, iso_639_3 = @iso_639_3, is_conlang = @is_conlang, name_native = @name_native, name_local = @name_local, direction = @direction
            WHERE id = @id;
        `);

        const result: RunResult = statement.run({ id: _language.id, dictionary_id: _language.dictionary_id, iso_639_1: _language.iso_639_1, iso_639_3: _language.iso_639_3, is_conlang: _language.is_conlang ? 1 : 0, name_native: _language.name_native, name_local: _language.name_local, direction: _language.direction });

        if (result.changes > 0) {
            return [true, _language.toJSON()];
        } else return [false, undefined];
    }

    public static delete(language_id: number): boolean {
        const statement: Statement<{ id: number }, number> = Database.GetDatabase().prepare(`
            DELETE FROM languages WHERE id = @id;
        `);

        const result: RunResult = statement.run({ id: language_id });

        return result.changes > 0;
    }
}