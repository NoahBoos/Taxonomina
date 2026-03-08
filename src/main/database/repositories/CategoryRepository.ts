import { RunResult, Statement } from "better-sqlite3";
import { I_Category } from "../../../shared/interfaces/I_Category";
import { Database } from "../Database";
import { ErrorDomain, TaxonominaError } from "../../../shared/errors/types";
import { Category } from "../models/Category";

export class CategoryRepository {
    public static readAll(dictionary_id: number): I_Category[] {
        const statement: Statement<{ dictionary_id: number }, I_Category> = Database.GetDatabase().prepare(`
            SELECT *
            FROM categories
            WHERE dictionary_id = @dictionary_id;
        `);

        return statement.all({ dictionary_id });
    }

    public static readAllByDefinition(definition_id: number): I_Category[] {
        const statement: Statement<{ definition_id: number }, I_Category> = Database.GetDatabase().prepare(`
            SELECT *
            FROM categories
            JOIN category_definition ON category_definition.category_id = categories.id
            WHERE category_definition.definition_id = @definition_id;
        `);

        return statement.all({ definition_id });
    }

    public static readOne(category_id: number): I_Category | undefined {
        const statement: Statement<{ id: number }, I_Category> = Database.GetDatabase().prepare(`
            SELECT *
            FROM categories
            WHERE id = @id;
        `);

        return statement.get({ id: category_id });
    }

    public static create(category: I_Category): [boolean, I_Category | undefined, TaxonominaError<ErrorDomain>[]] {
        const _category: Category = Category.hydrate(category);
        let [validation_success, errors] = _category.validate();
        if (!validation_success) return [false, undefined, errors];

        const statement: Statement<{ dictionary_id: number, name: string }, number> = Database.GetDatabase().prepare(`
            INSERT INTO categories (dictionary_id, name) VALUES (@dictionary_id, @name);
        `);

        const result: RunResult = statement.run({ dictionary_id: _category.dictionary_id, name: _category.name });

        if (result.changes > 0) {
            return [true, new Category(Number(result.lastInsertRowid), _category.dictionary_id, _category.name).toJSON(), []];
        } else return [false, undefined, errors];
    }

    public static update(category: I_Category): [boolean, I_Category | undefined, TaxonominaError<ErrorDomain>[]] {
        const _category: Category = Category.hydrate(category);
        let [validation_success, errors] = _category.validate();
        if (!validation_success) return [false, undefined, errors];

        const statement: Statement<{ id: number, dictionary_id: number, name: string }, number> = Database.GetDatabase().prepare(`
            UPDATE categories SET dictionary_id = @dictionary_id, name = @name
            WHERE id = @id;
        `);

        const result: RunResult = statement.run({ id: _category.id, dictionary_id: _category.dictionary_id, name: _category.name });

        if (result.changes > 0) {
            return [true, _category.toJSON(), []];
        } else return [false, undefined, errors];
    }

    public static delete(category_id: number): boolean {
        const statement: Statement<{ category_id: number }, number> = Database.GetDatabase().prepare(`
            DELETE FROM categories WHERE id = @category_id;
        `);

        const result: RunResult = statement.run({ category_id });

        return result.changes > 0;
    }
}