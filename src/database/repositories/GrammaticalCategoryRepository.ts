import {GrammaticalCategory} from "../models/GrammaticalCategory";
import {Database} from "../Database";
import {RunResult} from "better-sqlite3";
import {Entry} from "../models/Entry";

export class GrammaticalCategoryRepository {
    public static ReadAll(): GrammaticalCategory[] {
        const statement = Database.GetDatabase().prepare(`
            SELECT *
            FROM grammatical_categories
        `);
        return statement.all() as GrammaticalCategory[];
    }

    public static ReadAllByEntry(entry: Entry): GrammaticalCategory[] {
        const statement = Database.GetDatabase().prepare(`
            SELECT gramCat.*
            FROM grammatical_categories AS gramCat
            JOIN entry_grammatical_category AS entry_gramCat
                ON gramCat.id = entry_gramCat.grammatical_category_id
            WHERE entry_gramCat.entry_id = @id
        `);
        return statement.all(entry.GetQueryObject()) as GrammaticalCategory[];
    }

    public static ReadOne(id: number): GrammaticalCategory | undefined {
        const statement = Database.GetDatabase().prepare(`
            SELECT *
            FROM grammatical_categories
            WHERE id = @id
        `);
        return statement.get({id: id}) as GrammaticalCategory ?? undefined;
    }

    public static Create(category: GrammaticalCategory): [boolean, GrammaticalCategory | undefined] {
        const statement = Database.GetDatabase().prepare(`
            INSERT INTO grammatical_categories (name)
            VALUES (@name)
        `);
        const result: RunResult = statement.run(category.GetQueryObject());
        if (result.changes > 0) {
            return [true, new GrammaticalCategory(Number(result.lastInsertRowid), category.GetName())];
        } else return [false, undefined];
    }

    public static Update(category: GrammaticalCategory): [boolean, GrammaticalCategory | undefined] {
        const statement = Database.GetDatabase().prepare(`
            UPDATE grammatical_categories
            SET name = @name
            WHERE id = @id
        `);
        const result: RunResult = statement.run(category.GetQueryObject());
        if (result.changes > 0) {
            return [true, new GrammaticalCategory(Number(result.lastInsertRowid), category.GetName())];
        } else return [false, undefined];
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
