import BetterSqlite3 from "better-sqlite3";
import {app} from "electron";
import { join } from "path";
import {settings} from "../main";
import {SettingManager} from "../utils/SettingManager";

export class Database {
    private static instance: BetterSqlite3.Database;
    private static databasePath: string = join(app.getPath("userData"), "taxonomina.db");

    public static InitializeDatabase(): void {
        if (!this.instance) {
            this.instance = new BetterSqlite3(this.databasePath);
            console.log("Database created at " + this.databasePath);
            try {
                this.instance.pragma("foreign_key = ON");
                this.instance.pragma("journal_mode = WAL");

                const transaction = this.instance.transaction(() => {
                    this.UpdateDatabase();
                    this.CreateDatabaseTables();
                    this.CreateDatabaseIndexes();
                    if (!settings.isDatabaseInitialized) {
                        this.CreateDefaultTuples();
                        settings.isDatabaseInitialized = true;
                        SettingManager.SaveSetting(settings);
                    }
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
            
            CREATE TABLE IF NOT EXISTS grammatical_classes (
                id INTEGER PRIMARY KEY,
                dictionary_id INTEGER NOT NULL,
                name VARCHAR NOT NULL,
                FOREIGN KEY (dictionary_id) REFERENCES dictionaries(id)
                    ON UPDATE CASCADE ON DELETE CASCADE
            );
            
            CREATE TABLE IF NOT EXISTS languages (
                id INTEGER PRIMARY KEY,
                dictionary_id INTEGER NOT NULL,
                iso_639_1 VARCHAR,
                iso_639_3 VARCHAR,
                is_conlang BOOLEAN NOT NULL,
                name_native VARCHAR NOT NULL,
                name_local VARCHAR NOT NULL,
                direction TEXT NOT NULL,
                FOREIGN KEY (dictionary_id) REFERENCES dictionaries(id)
                    ON UPDATE CASCADE ON DELETE CASCADE
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
                FOREIGN KEY (dictionary_id) REFERENCES dictionaries(id)
                    ON UPDATE CASCADE ON DELETE CASCADE,
                FOREIGN KEY (language_id) REFERENCES languages(id)
                    ON UPDATE SET NULL ON DELETE SET NULL
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
            
            CREATE TABLE IF NOT EXISTS entry_entry (
                first_entry_id INTEGER NOT NULL,
                second_entry_id INTEGER NOT NULL,
                PRIMARY KEY(first_entry_id, second_entry_id),
                CHECK (first_entry_id < second_entry_id),
                FOREIGN KEY (first_entry_id) REFERENCES entries(id)
                    ON UPDATE CASCADE ON DELETE CASCADE,
                FOREIGN KEY (second_entry_id) REFERENCES entries(id)
                    ON UPDATE CASCADE ON DELETE CASCADE
            );
            
            CREATE TABLE IF NOT EXISTS entry_grammatical_class (
                entry_id INTEGER NOT NULL,
                grammatical_class_id INTEGER NOT NULL,
                PRIMARY KEY(entry_id, grammatical_class_id),
                FOREIGN KEY (entry_id) REFERENCES entries(id)
                    ON UPDATE CASCADE ON DELETE CASCADE,
                FOREIGN KEY (grammatical_class_id) REFERENCES grammatical_classes(id)
                    ON UPDATE CASCADE ON DELETE CASCADE
            );
            
            CREATE TABLE IF NOT EXISTS grammatical_genres (
                id INTEGER PRIMARY KEY,
                dictionary_id INTEGER NOT NULL,
                name VARCHAR NOT NULL,
                FOREIGN KEY (dictionary_id) REFERENCES dictionaries(id)
                    ON UPDATE CASCADE ON DELETE CASCADE
            );
            
            CREATE TABLE IF NOT EXISTS entry_grammatical_genre (
                entry_id INTEGER NOT NULL,
                grammatical_genre_id INTEGER NOT NULL,
                PRIMARY KEY(entry_id, grammatical_genre_id),
                FOREIGN KEY (entry_id) REFERENCES entries(id)
                    ON UPDATE CASCADE ON DELETE CASCADE,
                FOREIGN KEY (grammatical_genre_id) REFERENCES grammatical_genres(id)
                    ON UPDATE CASCADE ON DELETE CASCADE
            );
        `);
    }

    private static CreateDatabaseIndexes() {
        this.instance.exec(`
            -- Index pour accélérer les JOIN fréquents
            CREATE INDEX IF NOT EXISTS idx_languages_dictionary_id ON languages(dictionary_id);
            CREATE INDEX IF NOT EXISTS idx_entries_dictionary_id ON entries(dictionary_id);
            CREATE INDEX IF NOT EXISTS idx_grammatical_classes_dictionary_id ON grammatical_classes(dictionary_id);
            CREATE INDEX IF NOT EXISTS idx_grammatical_genres_dictionary_id ON grammatical_genres(dictionary_id);
            CREATE INDEX IF NOT EXISTS idx_entries_dictionary_id ON entries(dictionary_id);
            CREATE INDEX IF NOT EXISTS idx_entries_language_id ON entries(language_id);
            CREATE INDEX IF NOT EXISTS idx_entry_definition_definition_id ON entry_definition(definition_id);
            CREATE INDEX IF NOT EXISTS idx_entry_entry_second ON entry_entry (second_entry_id);
        `);
    }

    private static CreateDefaultTuples() {
        this.instance.exec(`
            INSERT INTO dictionaries (name, description)
            VALUES ('Mon dictionnaire', 'C''est mon superbe dictionnaire !');

            INSERT INTO languages (dictionary_id, iso_639_1, iso_639_3, is_conlang, name_native, name_local, direction)
            VALUES (1, 'fr', 'fra', 'false', 'Français', 'Français', 'ltr');

            INSERT INTO languages (dictionary_id, iso_639_1, iso_639_3, is_conlang, name_native, name_local, direction)
            VALUES (1, 'de', 'deu', 'false', 'Deutsch', 'Allemand', 'ltr');
        `);
    }

    private static UpdateDatabase() {
        this.RenameTable('grammatical_categories', 'grammatical_classes');
        this.RenameTable('entry_grammatical_category', 'entry_grammatical_class');
        this.RenameColumn('entry_grammatical_class', 'grammatical_category_id', 'grammatical_class_id');
        this.RenameIndex('idx_grammatical_categories_dictionary_id', 'idx_grammatical_classes_dictionary_id', 'grammatical_classes', 'dictionary_id');
    }

    public static BeginTransaction() {
        this.GetDatabase().exec("BEGIN TRANSACTION;");
    }

    public static CommitTransaction() {
        this.GetDatabase().exec("COMMIT;");
    }

    public static RollbackTransaction() {
        this.GetDatabase().exec("ROLLBACK;");
    }

    public static IsTableExists(tableName: string): boolean {
        const statement = this.instance.prepare(`
            SELECT 1
            FROM sqlite_master
            WHERE type='table' AND name=@tableName
            LIMIT 1;
        `);
        const row = statement.get({tableName: tableName});
        return !!row;
    }

    public static RenameTable(oldTableName: string, newTableName: string): void {
        if (!this.IsTableExists(oldTableName)) return;
        this.instance.prepare(`ALTER TABLE ${oldTableName} RENAME TO ${newTableName};`).run();
        return;
    }

    public static IsColumnExists(tableName: string, columnName: string): boolean {
        const statement = this.instance.prepare(`
            SELECT 1
            FROM pragma_table_info('${tableName}')
            WHERE name='${columnName}'
            LIMIT 1;
        `);
        return !!statement.get();
    }

    public static RenameColumn(tableName: string, oldColumnName: string, newColumnName: string): void {
        if (!this.IsTableExists(tableName)) return;
        if (!this.IsColumnExists(tableName, oldColumnName)) return;
        if (this.IsColumnExists(tableName, newColumnName)) return;
        this.instance.prepare(`ALTER TABLE ${tableName} RENAME COLUMN ${oldColumnName} TO ${newColumnName};`).run();
        return;
    }

    public static IsIndexExists(indexName: string): boolean {
        const statement = this.instance.prepare(`
            SELECT 1 
            FROM sqlite_master 
            WHERE type='index' AND name=@indexName
            LIMIT 1;
        `);
        const row = statement.get({indexName: indexName})
        return !!row;
    }

    public static RenameIndex(oldIndexName: string, newIndexName: string, table: string, column: string): void {
        if (!this.IsIndexExists(oldIndexName)) return;
        this.instance.prepare(`
            DROP INDEX IF EXISTS ${oldIndexName};
        `).run();
        this.instance.prepare(`
            CREATE INDEX IF NOT EXISTS ${newIndexName} ON ${table}(${column});
        `).run();
        return;
    }
}