import {GrammaticalCategory} from "../models/GrammaticalCategory";
import {Database} from "../Database";
import {RunResult} from "better-sqlite3";

export class GrammaticalCategoryRepository {
    public static ReadAll(): GrammaticalCategory[] {
        const statement = Database.GetDatabase().prepare(`
            SELECT *
            FROM grammatical_categories
        `);
        return statement.all() as GrammaticalCategory[];
    }

    public static ReadOne(id: number): GrammaticalCategory | undefined {
        const statement = Database.GetDatabase().prepare(`
            SELECT *
            FROM grammatical_categories
            WHERE id = @id
        `);
        return statement.get({id: id}) as GrammaticalCategory ?? undefined;
    }

    public static Create(category: GrammaticalCategory): boolean {
        const statement = Database.GetDatabase().prepare(`
            INSERT INTO grammatical_categories (name)
            VALUES (@name)
        `);
        const result: RunResult = statement.run(category.GetQueryObject());
        return result.changes > 0;
    }

    public static Update(category: GrammaticalCategory): boolean {
        const statement = Database.GetDatabase().prepare(`
            UPDATE grammatical_categories
            SET name = @name
            WHERE id = @id
        `);
        const result: RunResult = statement.run(category.GetQueryObject());
        return result.changes > 0;
    }

    public static Delete(category: GrammaticalCategory): boolean {
        const statement = Database.GetDatabase().prepare(`
            DELETE
            FROM grammatical_categories
            WHERE id = @id
        `);
        const result: RunResult = statement.run(category.GetQueryObject());
        return result.changes > 0;
    }
}
