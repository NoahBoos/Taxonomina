import BetterSqlite3 from "better-sqlite3";
import {app} from "electron";
import { join } from "path";

export class Database {
    private static instance: BetterSqlite3.Database;
    private static databasePath: string = join(app.getPath("userData"), "taxonomina.db");

    public static InitializeDatabase(): void {
        if (!this.instance) {
            this.instance = new BetterSqlite3(this.databasePath);
            console.log("Database created at " + this.databasePath);
            try {
                this.instance.pragma("foreign_key = ON");

                const transaction = this.instance.transaction(() => {
                    this.CreateDatabaseTables();
                    this.CreateDatabaseIndexes();
                });

                transaction();
                console.log("La BDD est créée avec succès.");
            } catch (error) {
                console.error("Une erreur est survenu lors de la création de la BDD : ", error);
            }
        }
    }

    public static GetDatabase(): BetterSqlite3.Database {
        this.InitializeDatabase();
        return this.instance;
    }

    private static CreateDatabaseTables() {
        this.instance.exec(`
            -- Tables principales
            CREATE TABLE IF NOT EXISTS dictionaries (
                id INTEGER PRIMARY KEY,
                name VARCHAR NOT NULL,
                description TEXT NOT NULL
            );
            
            CREATE TABLE IF NOT EXISTS grammatical_categories (
                id INTEGER PRIMARY KEY,
                name VARCHAR NOT NULL
            );
            
            CREATE TABLE IF NOT EXISTS languages (
                id INTEGER PRIMARY KEY,
                iso_639_1 VARCHAR,
                iso_639_3 VARCHAR,
                is_conlang BOOLEAN NOT NULL,
                name_native VARCHAR NOT NULL,
                name_local VARCHAR NOT NULL,
                direction BLOB NOT NULL
            );
            
            CREATE TABLE IF NOT EXISTS definitions (
                id INTEGER PRIMARY KEY,
                definition TEXT NOT NULL
            );
            
            -- Tables dépendantes
            CREATE TABLE IF NOT EXISTS entries (
                id INTEGER PRIMARY KEY,
                dictionary_id INTEGER NOT NULL,
                language_id INTEGER,
                lemma VARCHAR NOT NULL,
                grammatical_category_id INTEGER,
                FOREIGN KEY (dictionary_id) REFERENCES dictionaries(id)
                    ON UPDATE CASCADE ON DELETE CASCADE,
                FOREIGN KEY (language_id) REFERENCES languages(id)
                    ON UPDATE SET NULL ON DELETE SET NULL,
                FOREIGN KEY (grammatical_category_id) REFERENCES grammatical_categories(id)
                    ON UPDATE CASCADE ON DELETE SET NULL
            );
            
            CREATE TABLE IF NOT EXISTS entry_definition (
                entry_id INTEGER NOT NULL,
                definition_id INTEGER NOT NULL,
                PRIMARY KEY(entry_id, definition_id),
                FOREIGN KEY (entry_id) REFERENCES entries(id)
                    ON UPDATE CASCADE ON DELETE CASCADE,
                FOREIGN KEY (definition_id) REFERENCES definitions(id)
                    ON UPDATE CASCADE ON DELETE CASCADE
            );
            
            CREATE TABLE IF NOT EXISTS inflections (
                id INTEGER PRIMARY KEY,
                entry_id INTEGER NOT NULL,
                inflection VARCHAR NOT NULL,
                FOREIGN KEY (entry_id) REFERENCES entries(id)
                    ON UPDATE CASCADE ON DELETE CASCADE
            );
            
            CREATE TABLE IF NOT EXISTS grammatical_genres (
                id INTEGER PRIMARY KEY,
                name VARCHAR NOT NULL
            );
            
            CREATE TABLE IF NOT EXISTS inflection_grammatical_genre (
                inflection_id INTEGER NOT NULL,
                grammatical_genre_id INTEGER NOT NULL,
                PRIMARY KEY(inflection_id, grammatical_genre_id),
                FOREIGN KEY (inflection_id) REFERENCES inflections(id)
                    ON UPDATE CASCADE ON DELETE CASCADE,
                FOREIGN KEY (grammatical_genre_id) REFERENCES grammatical_genres(id)
                    ON UPDATE CASCADE ON DELETE CASCADE
            );
            
            CREATE TABLE IF NOT EXISTS grammatical_numbers (
                id INTEGER PRIMARY KEY,
                name VARCHAR NOT NULL
            );
            
            CREATE TABLE IF NOT EXISTS inflection_grammatical_number (
                inflection_id INTEGER NOT NULL,
                grammatical_number_id INTEGER NOT NULL,
                PRIMARY KEY(inflection_id, grammatical_number_id),
                FOREIGN KEY (inflection_id) REFERENCES inflections(id)
                    ON UPDATE CASCADE ON DELETE CASCADE,
                FOREIGN KEY (grammatical_number_id) REFERENCES grammatical_numbers(id)
                    ON UPDATE CASCADE ON DELETE CASCADE
            );
            
            CREATE TABLE IF NOT EXISTS grammatical_cases (
                id INTEGER PRIMARY KEY,
                name VARCHAR NOT NULL
            );
            
            CREATE TABLE IF NOT EXISTS inflection_grammatical_case (
                inflection_id INTEGER NOT NULL,
                grammatical_case_id INTEGER NOT NULL,
                PRIMARY KEY(inflection_id, grammatical_case_id),
                FOREIGN KEY (inflection_id) REFERENCES inflections(id)
                    ON UPDATE CASCADE ON DELETE CASCADE,
                FOREIGN KEY (grammatical_case_id) REFERENCES grammatical_cases(id)
                    ON UPDATE CASCADE ON DELETE CASCADE
            );
            
            CREATE TABLE IF NOT EXISTS entry_inflection (
                entry_id INTEGER NOT NULL,
                inflection_id INTEGER NOT NULL,
                PRIMARY KEY(entry_id, inflection_id),
                FOREIGN KEY (entry_id) REFERENCES entries(id)
                    ON UPDATE CASCADE ON DELETE CASCADE,
                FOREIGN KEY (inflection_id) REFERENCES inflections(id)
                    ON UPDATE CASCADE ON DELETE CASCADE
            );
        `);
    }

    private static CreateDatabaseIndexes() {
        this.instance.exec(`
            -- Index pour accélérer les JOIN fréquents
            CREATE INDEX IF NOT EXISTS idx_entries_dictionary_id ON entries(dictionary_id);
            CREATE INDEX IF NOT EXISTS idx_entries_language_id ON entries(language_id);
            CREATE INDEX IF NOT EXISTS idx_entries_grammatical_category_id ON entries(grammatical_category_id);
            CREATE INDEX IF NOT EXISTS idx_inflections_entry_id ON inflections(entry_id);
            CREATE INDEX IF NOT EXISTS idx_entry_definition_definition_id ON entry_definition(definition_id);
            CREATE INDEX IF NOT EXISTS idx_inflection_grammatical_genre_genre_id ON inflection_grammatical_genre(grammatical_genre_id);
            CREATE INDEX IF NOT EXISTS idx_inflection_grammatical_number_number_id ON inflection_grammatical_number(grammatical_number_id);
            CREATE INDEX IF NOT EXISTS idx_inflection_grammatical_case_case_id ON inflection_grammatical_case(grammatical_case_id);
            CREATE INDEX IF NOT EXISTS idx_entry_inflection_inflection_id ON entry_inflection(inflection_id);
        `);
    }
}