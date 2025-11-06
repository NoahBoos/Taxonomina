export class DatabaseService {
    public static async BeginTransaction() {
        await window.txnmAPI.database.BeginTransaction();
    }

    public static async CommitTransaction() {
        await window.txnmAPI.database.CommitTransaction();
    }

    public static async RollbackTransaction() {
        await window.txnmAPI.database.RollbackTransaction();
    }
}