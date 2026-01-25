export class DatabaseService {
    public static async beginTransaction(): Promise<void> {
        await window.txnmAPI.database.BeginTransaction();
    }

    public static async commitTransaction(): Promise<void> {
        await window.txnmAPI.database.CommitTransaction();
    }

    public static async rollbackTransaction(): Promise<void> {
        await window.txnmAPI.database.RollbackTransaction();
    }
}