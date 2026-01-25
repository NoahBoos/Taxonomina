export class DatabaseService {
    public static async beginTransaction() {
        await window.txnmAPI.database.BeginTransaction();
    }

    public static async commitTransaction() {
        await window.txnmAPI.database.CommitTransaction();
    }

    public static async rollbackTransaction() {
        await window.txnmAPI.database.RollbackTransaction();
    }
}