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
        }
    }

    public static GetDatabase(): BetterSqlite3.Database {
        this.InitializeDatabase();
        return this.instance;
    }
}