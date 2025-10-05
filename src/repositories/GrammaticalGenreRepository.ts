import {GrammaticalGenre} from "../models/GrammaticalGenre";
import {Database} from "../database/Database";
import {RunResult} from "better-sqlite3";

export class GrammaticalGenreRepository {
    public static ReadAll(): GrammaticalGenre[] {
        const statement = Database.GetDatabase().prepare(`
            SELECT *
            FROM grammatical_genres
        `);
        return statement.all() as GrammaticalGenre[];
    }

    public static ReadOne(id: number): GrammaticalGenre | undefined {
        const statement = Database.GetDatabase().prepare(`
            SELECT *
            FROM grammatical_genres
            WHERE id = @id
        `);
        return statement.get({id: id}) as GrammaticalGenre;
    }

    public static Create(genre: GrammaticalGenre): boolean {
        const statement = Database.GetDatabase().prepare(`
            INSERT INTO grammatical_genres (name)
            VALUES (@name)
        `);
        const result: RunResult = statement.run(genre.GetQueryObject());
        return result.changes > 0;
    }

    public static Update(genre: GrammaticalGenre): boolean {
        const statement = Database.GetDatabase().prepare(`
            UPDATE grammatical_genres
            SET name = @name
            WHERE id = @id
        `);
        const result: RunResult = statement.run(genre.GetQueryObject());
        return result.changes > 0;
    }

    public static Delete(genre: GrammaticalGenre): boolean {
        const statement = Database.GetDatabase().prepare(`
            DELETE
            FROM grammatical_genres
            WHERE id = @id
        `);
        const result: RunResult = statement.run(genre.GetQueryObject());
        return result.changes > 0;
    }
}
