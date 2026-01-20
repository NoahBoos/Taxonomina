import {Language} from "../models/Language";
import {Database} from "../Database";
import {RunResult} from "better-sqlite3";
import {I_Language} from "../../../shared/interfaces/I_Language";

export class LanguageRepository {
    public static ReadAll(dictionary_id: number): I_Language[] {
        const statement = Database.GetDatabase().prepare(`
            SELECT *
            FROM languages
            WHERE dictionary_id = @dictionary_id
        `);
        return statement.all({"dictionary_id": dictionary_id}) as I_Language[];
    }

    public static ReadOne(id: number): I_Language | undefined {
        const statement = Database.GetDatabase().prepare(`
            SELECT *
            FROM languages
            WHERE id = @language_id
        `);
        return statement.get({language_id: id}) as I_Language ?? undefined;
    }

    public static Create(language: Language): [boolean, I_Language | undefined] {
        const statement = Database.GetDatabase().prepare(`
            INSERT INTO languages (dictionary_id, iso_639_1, iso_639_3, is_conlang, name_native, name_local, direction)
            values (@dictionary_id, @iso_639_1, @iso_639_3, @is_conlang, @name_native, @name_local, @direction)
        `);
        const result: RunResult = statement.run(language.toDatabaseObject());
        if (result.changes > 0) {
            return [true, new Language(Number(result.lastInsertRowid), language.dictionary_id, language.iso_639_1, language.iso_639_3, language.is_conlang, language.name_native, language.name_local, language.direction).toJSON()];
        } else return [false, undefined];
    }

    public static Update(language: Language): [boolean, I_Language | undefined] {
        const statement = Database.GetDatabase().prepare(`
            UPDATE languages
            SET iso_639_1 = @iso_639_1, 
                iso_639_3 = @iso_639_3,
                is_conlang = @is_conlang, 
                name_native = @name_native,
                name_local = @name_local, 
                direction = @direction
            WHERE id = @language_id
        `);
        const result: RunResult = statement.run(language.toDatabaseObject());
        if (result.changes > 0) {
            return [true, new Language(language.id, language.dictionary_id, language.iso_639_1, language.iso_639_3, language.is_conlang, language.name_native, language.name_local, language.direction).toJSON()];
        } else return [false, undefined];
    }

    public static Delete(language: Language): boolean {
        const statement = Database.GetDatabase().prepare(`
            DELETE
            FROM languages
            WHERE id = @language_id
        `)
        const result: RunResult = statement.run(language.toDatabaseObject());
        return result.changes > 0;
    }
}