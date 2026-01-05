import {ipcMain} from "electron";
import {Database} from "../database/Database";

export function RegisterDatabaseIPCHandlers() {
    ipcMain.handle("txnmAPI:database:beginTransaction", () => {
        return Database.BeginTransaction();
    });

    ipcMain.handle("txnmAPI:database:commitTransaction", () => {
        return Database.CommitTransaction();
    });

    ipcMain.handle("txnmAPI:database:rollbackTransaction", () => {
        return Database.RollbackTransaction();
    });
}