import {Language} from "../../../shared/models/Language";
import {Database} from "../Database";
import {RunResult} from "better-sqlite3";
import {Dictionary} from "../../../shared/models/Dictionary";

export class LanguageRepository {
    public static ReadAll(dictionary_id: number): Language[] {
        const statement = Database.GetDatabase().prepare(`
            SELECT *
            FROM languages
            WHERE dictionary_id = @dictionary_id
        `);
        return statement.all({"dictionary_id": dictionary_id}) as Language[];
    }

    public static ReadOne(id: number): Language | undefined {
        const statement = Database.GetDatabase().prepare(`
            SELECT *
            FROM languages
            WHERE id = @language_id
        `);
        return statement.get({language_id: id}) as Language ?? undefined;
    }

    public static Create(language: Language): [boolean, Language | undefined] {
        const statement = Database.GetDatabase().prepare(`
            INSERT INTO languages (dictionary_id, iso_639_1, iso_639_3, is_conlang, name_native, name_local, direction)
            values (@dictionary_id, @iso_639_1, @iso_639_3, @is_conlang, @name_native, @name_local, @direction)
        `);
        const result: RunResult = statement.run(language.GetQueryObject());
        if (result.changes > 0) {
            return [true, new Language(Number(result.lastInsertRowid), language.GetDictionaryId(), language.GetIso639_1(), language.GetIso639_3(), language.GetIsConlang(), language.GetNameNative(), language.GetNameLocal(), language.GetDirection())];
        } else return [false, undefined];
    }

    public static Update(language: Language): [boolean, Language | undefined] {
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
        const result: RunResult = statement.run(language.GetQueryObject());
        if (result.changes > 0) {
            return [true, new Language(language.GetId(), language.GetDictionaryId(), language.GetIso639_1(), language.GetIso639_3(), language.GetIsConlang(), language.GetNameNative(), language.GetNameLocal(), language.GetDirection())];
        } else return [false, undefined];
    }

    public static Delete(language: Language): boolean {
        const statement = Database.GetDatabase().prepare(`
            DELETE
            FROM languages
            WHERE id = @language_id
        `)
        const result: RunResult = statement.run(language.GetQueryObject());
        return result.changes > 0;
    }
}