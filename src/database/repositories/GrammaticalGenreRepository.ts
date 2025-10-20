import {GrammaticalGenre} from "../models/GrammaticalGenre";
import {Database} from "../Database";
import {RunResult} from "better-sqlite3";
import {Entry} from "../models/Entry";

export class GrammaticalGenreRepository {
    public static ReadAll(): GrammaticalGenre[] {
        const statement = Database.GetDatabase().prepare(`
            SELECT *
            FROM grammatical_genres
        `);
        return statement.all() as GrammaticalGenre[];
    }

    public static ReadAllByEntry(entry: Entry): GrammaticalGenre[] {
        const statement = Database.GetDatabase().prepare(`
            SELECT gramGenre.*
            FROM grammatical_genres AS gramGenre
            JOIN  entry_grammatical_genre AS entry_gramGenre
                ON gramGenre.id = entry_gramGenre.grammatical_genre_id
            WHERE entry_gramGenre.entry_id = @entry_id
        `);
        return statement.all(entry.GetQueryObject()) as GrammaticalGenre[];
    }

    public static ReadOne(id: number): GrammaticalGenre | undefined {
        const statement = Database.GetDatabase().prepare(`
            SELECT *
            FROM grammatical_genres
            WHERE id = @grammatical_genre_id
        `);
        return statement.get({grammatical_genre_id: id}) as GrammaticalGenre;
    }

    public static Create(genre: GrammaticalGenre): [boolean, GrammaticalGenre | undefined] {
        const statement = Database.GetDatabase().prepare(`
            INSERT INTO grammatical_genres (name)
            VALUES (@name)
        `);
        const result: RunResult = statement.run(genre.GetQueryObject());
        if (result.changes > 0) {
            return [true, new GrammaticalGenre(Number(result.lastInsertRowid), genre.GetName())];
        } else return [false, undefined];
    }

    public static Update(genre: GrammaticalGenre): [boolean, GrammaticalGenre | undefined] {
        const statement = Database.GetDatabase().prepare(`
            UPDATE grammatical_genres
            SET name = @name
            WHERE id = @grammatical_genre_id
        `);
        const result: RunResult = statement.run(genre.GetQueryObject());
        if (result.changes > 0) {
            return [true, new GrammaticalGenre(Number(result.lastInsertRowid), genre.GetName())];
        } else return [false, undefined];
    }

    public static Delete(genre: GrammaticalGenre): boolean {
        const statement = Database.GetDatabase().prepare(`
            DELETE
            FROM grammatical_genres
            WHERE id = @grammatical_genre_id
        `);
        const result: RunResult = statement.run(genre.GetQueryObject());
        return result.changes > 0;
    }
}
