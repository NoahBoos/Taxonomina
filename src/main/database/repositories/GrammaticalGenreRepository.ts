import {GrammaticalGenre} from "../models/GrammaticalGenre";
import {Database} from "../Database";
import { RunResult, Statement } from "better-sqlite3";
import {I_GrammaticalGenre} from "../../../shared/interfaces/I_GrammaticalGenre";
import { ErrorDomain, TaxonominaError } from "../../../shared/errors/types";

export class GrammaticalGenreRepository {
    public static readAll(dictionary_id: number): I_GrammaticalGenre[] {
        const statement: Statement<{ dictionary_id: number }, I_GrammaticalGenre> = Database.GetDatabase().prepare(`
            SELECT *
            FROM grammatical_genres
            WHERE dictionary_id = @dictionary_id;
        `);

        return statement.all({ dictionary_id });
    }

    public static readAllByEntry(entry_id: number): I_GrammaticalGenre[] {
        const statement: Statement<{ entry_id: number }, I_GrammaticalGenre> = Database.GetDatabase().prepare(`
            SELECT grammatical_genres.*
            FROM grammatical_genres
            JOIN  entry_grammatical_genre ON grammatical_genres.id = entry_grammatical_genre.grammatical_genre_id
            WHERE entry_grammatical_genre.entry_id = @entry_id;
        `);

        return statement.all({ entry_id });
    }

    public static readOne(grammatical_genre_id: number): I_GrammaticalGenre | undefined {
        const statement: Statement<{ id: number }, I_GrammaticalGenre> = Database.GetDatabase().prepare(`
            SELECT *
            FROM grammatical_genres
            WHERE id = @id;
        `);

        return statement.get({ id: grammatical_genre_id });
    }

    public static create(grammatical_genre: I_GrammaticalGenre): [boolean, I_GrammaticalGenre | undefined, TaxonominaError<ErrorDomain>[]] {
        const _grammatical_genre: GrammaticalGenre = GrammaticalGenre.hydrate(grammatical_genre);
        let [validation_success, errors] = _grammatical_genre.validate();
        if (!validation_success) return [false, undefined, errors];

        const statement: Statement<{ dictionary_id: number, name: string }, number> = Database.GetDatabase().prepare(`
            INSERT INTO grammatical_genres (dictionary_id, name) VALUES (@dictionary_id, @name);
        `);

        const result: RunResult = statement.run({ dictionary_id: _grammatical_genre.dictionary_id, name: _grammatical_genre.name });

        if (result.changes > 0) {
            return [true, new GrammaticalGenre(Number(result.lastInsertRowid), _grammatical_genre.dictionary_id, _grammatical_genre.name).toJSON(), []];
        } else return [false, undefined, errors];
    }

    public static update(grammatical_genre: I_GrammaticalGenre): [boolean, I_GrammaticalGenre | undefined, TaxonominaError<ErrorDomain>[]] {
        const _grammatical_genre: GrammaticalGenre = GrammaticalGenre.hydrate(grammatical_genre);
        let [validation_success, errors] = _grammatical_genre.validate();
        if (!validation_success) return [false, undefined, errors];

        const statement: Statement<{ id: number, dictionary_id: number, name: string }, number> = Database.GetDatabase().prepare(`
            UPDATE grammatical_genres SET name = @name
            WHERE id = @id;
        `);

        const result: RunResult = statement.run({ id: _grammatical_genre.id, dictionary_id: _grammatical_genre.dictionary_id, name: _grammatical_genre.name });

        if (result.changes > 0) {
            return [true, _grammatical_genre.toJSON(), []];
        } else return [false, undefined, errors];
    }

    public static delete(grammatical_genre_id: number): boolean {
        const statement: Statement<{ grammatical_genre_id: number }, number> = Database.GetDatabase().prepare(`
            DELETE FROM grammatical_genres WHERE id = @grammatical_genre_id;
        `);

        const result: RunResult = statement.run({ grammatical_genre_id });

        return result.changes > 0;
    }
}
