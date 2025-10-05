import {Language} from "../models/Language";
import {Database} from "../Database";
import {RunResult} from "better-sqlite3";

export class LanguageRepository {
    public static ReadAll(): Language[] {
        const statement = Database.GetDatabase().prepare(`
            SELECT *
            FROM languages
        `);
        return statement.all() as Language[];
    }

    public static ReadOne(id: number): Language | undefined {
        const statement = Database.GetDatabase().prepare(`
            SELECT *
            FROM languages
            WHERE id = @id
        `);
        return statement.get({id: id}) as Language ?? undefined;
    }

    public static Create(language: Language): boolean {
        const statement = Database.GetDatabase().prepare(`
            INSERT INTO languages (iso_639_1, iso_639_3, is_conlang, name_native, name_local, direction)
            values (@iso_639_1, @iso_639_3, @is_conlang, @name_native, @name_local, @direction)
        `);
        const result: RunResult = statement.run(language.GetQueryObject());
        return result.changes > 0;
    }

    public static Update(language: Language): boolean {
        const statement = Database.GetDatabase().prepare(`
            UPDATE languages
            SET iso_639_1 = @iso_639_1, 
                iso_639_3 = @iso_639_3,
                is_conlang = @is_conlang, 
                name_native = @name_native,
                name_local = @name_local, 
                direction = @direction
            WHERE id = @id
        `);
        const result: RunResult = statement.run(language.GetQueryObject());
        return result.changes > 0;
    }

    public static Delete(language: Language): boolean {
        const statement = Database.GetDatabase().prepare(`
            DELETE
            FROM languages
            WHERE id = @id
        `)
        const result: RunResult = statement.run(language.GetQueryObject());
        return result.changes > 0;
    }
}