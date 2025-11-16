import {Entry} from "../database/models/Entry";
import {Definition} from "../database/models/Definition";
import {TaxonominaSettings} from "../interfaces/I_TaxonominaSettings";
import {GrammaticalCategory} from "../database/models/GrammaticalCategory";
import {GrammaticalGenre} from "../database/models/GrammaticalGenre";
import {GrammaticalCategoryService} from "./GrammaticalCategoryService";
import {GrammaticalGenreService} from "./GrammaticalGenreService";
import {DefinitionService} from "./DefinitionService";
import {DatabaseService} from "./DatabaseService";

export class EntryService {
    public static async ReadAll(dictionary_id: number): Promise<Entry[]> {
        const rawEntries: Entry[] = await window.txnmAPI.repositories.entry.ReadAll(dictionary_id);
        return rawEntries.map((rawEntry: Entry): Entry => Entry.Hydrate(rawEntry));
    }

    public static async ReadAllByGlobalTranslation(rawEntry: Entry): Promise<Entry[]> {
        const rawEntries: Entry[] = await window.txnmAPI.repositories.entry.ReadAllByGlobalTranslation(rawEntry);
        return rawEntries.map((rawEntry: Entry) => Entry.Hydrate(rawEntry));
    }

    public static async ReadAllByLocalTranslation(rawDefinition: Definition): Promise<Entry[]> {
        const rawEntries: Entry[] = await window.txnmAPI.repositories.entry.ReadAllByLocalTranslation(rawDefinition);
        return rawEntries.map((rawEntry: Entry) => Entry.Hydrate(rawEntry));
    }

    public static async ReadOne(entryId: number): Promise<Entry> {
        const rawEntry: Entry = await window.txnmAPI.repositories.entry.ReadOne(entryId);
        return Entry.Hydrate(rawEntry);
    }

    public static async BindToGrammaticalCategory(entry: Entry, category: GrammaticalCategory) {
        return await window.txnmAPI.repositories.entry.BindToGrammaticalCategory(entry, category);
    }

    public static async UnbindFromGrammaticalCategory(entry: Entry, category: GrammaticalCategory) {
        return await window.txnmAPI.repositories.entry.UnbindFromGrammaticalCategory(entry, category);
    }

    public static async BindToGrammaticalGenre(entry: Entry, genre: GrammaticalGenre) {
        return await window.txnmAPI.repositories.entry.BindToGrammaticalGenre(entry, genre);
    }

    public static async UnbindFromGrammaticalGenre(entry: Entry, genre: GrammaticalGenre) {
        return await window.txnmAPI.repositories.entry.UnbindFromGrammaticalGenre(entry, genre);
    }

    public static async BindToTranslation(entry: Entry, translation: Entry) {
        return await window.txnmAPI.repositories.entry.BindToTranslation(entry, translation);
    }

    public static async UnbindFromTranslation(entry: Entry, translation: Entry) {
        return await window.txnmAPI.repositories.entry.UnbindFromTranslation(entry, translation);
    }

    public static async Save(entry: Entry): Promise<[boolean, Entry | undefined]> {
        let [success, savedEntry] = entry.GetId() == 0
            ? await window.txnmAPI.repositories.entry.Create(entry)
            : await window.txnmAPI.repositories.entry.Update(entry);
        return [success, Entry.Hydrate(savedEntry)];
    }

    public static async Delete(entry: Entry): Promise<boolean> {
        return await window.txnmAPI.repositories.entry.Delete(entry);
    }

    public static async FilterBySearch(dictionary_id: number, query: string): Promise<Entry[]> {
        const entries: Entry[] = await EntryService.ReadAll(dictionary_id);
        return entries.filter(entry => {
            return [entry.GetLemma()].some(value => value.toLowerCase().includes(query.toLowerCase()));
        });
    }

    public static async ProcessForm(form: Element) {
        await DatabaseService.BeginTransaction();
        try {
            const [success, entry] = await EntryService.ProcessEntry(form);
            console.log("Entry added successfully.");
            if (success && entry) {
                await EntryService.ProcessGrammaticalCategories(form, entry);
                console.log("Grammatical categories processed successfully.");
                await EntryService.ProcessGrammaticalGenres(form, entry);
                console.log("Grammatical genres processed successfully.");
                await EntryService.ProcessGlobalTranslations(form, entry);
                console.log("Global translations processed successfully.");
                await EntryService.ProcessDefinitions(form, entry);
                console.log("Definitions processed successfully.");
                await DatabaseService.CommitTransaction();
                return entry;
            }
        } catch (error) {
            await DatabaseService.RollbackTransaction();
        }
    }

    public static async ProcessEntry(form: Element): Promise<[boolean, Entry | undefined]> {
        const settings: TaxonominaSettings = await window.txnmAPI.settings.Load();
        const fieldset: HTMLDivElement = form.querySelector("#lemma-section")!;
        const id: number = parseInt(fieldset.querySelector<HTMLInputElement>("input#entry_id")!.value);
        const lemma: string = fieldset.querySelector<HTMLInputElement>("input#lemma")!.value;
        const language_id: number = parseInt(fieldset.querySelector<HTMLSelectElement>("select#language")!.value);
        const entry = new Entry(id, settings.currentDictionary, language_id, lemma);
        if (!entry.Validate()) throw new Error(`Unable to validate entry: ${entry}`);
        entry.Normalize();
        return await EntryService.Save(entry);
    }

    public static async ProcessGrammaticalCategories(form: Element, entry: Entry) {
        const fieldset: HTMLDivElement = form.querySelector("#grammatical-categories")!;
        const checkboxes: NodeListOf<HTMLInputElement> = fieldset.querySelectorAll<HTMLInputElement>('input[name="grammatical-category"]');
        const entryCategories: GrammaticalCategory[] = await GrammaticalCategoryService.ReadAllByEntry(entry);

        for (const checkbox of checkboxes) {
            // TODO : Récupération via mapping des catégories, pour éviter les surcharges sur la BDD.
            const category: GrammaticalCategory = await GrammaticalCategoryService.ReadOne(Number(checkbox.value));
            const isBound: boolean = entryCategories.some(loopedCategory => loopedCategory.GetId() == category.GetId());
            if (checkbox.checked) {
                if (isBound) continue;
                await EntryService.BindToGrammaticalCategory(entry, category);
            } else {
                if (!isBound) continue;
                await EntryService.UnbindFromGrammaticalCategory(entry, category);
            }
        }
    }

    public static async ProcessGrammaticalGenres(form: Element, entry: Entry) {
        const fieldset: HTMLDivElement = form.querySelector("#grammatical-genres")!;
        const checkboxes: NodeListOf<HTMLInputElement> = fieldset.querySelectorAll<HTMLInputElement>('input[name="grammatical-genre"]');
        const entryGenres: GrammaticalGenre[] = await GrammaticalGenreService.ReadAllByEntry(entry);

        for (const checkbox of checkboxes) {
            // TODO : Récupération via mapping des genres, pour éviter les surcharges sur la BDD.
            const genre: GrammaticalGenre = await GrammaticalGenreService.ReadOne(Number(checkbox.value));
            const isBound: boolean = entryGenres.some(loopedGenre => loopedGenre.GetId() == genre.GetId());
            if (checkbox.checked) {
                if (isBound) continue;
                await EntryService.BindToGrammaticalGenre(entry, genre);
            } else {
                if (!isBound) continue;
                await EntryService.UnbindFromGrammaticalGenre(entry, genre);
            }
        }
    }

    public static async ProcessGlobalTranslations(form: Element, entry: Entry) {
        const fieldset: HTMLDivElement = form.querySelector("#global-translations-section")!;
        const tags: NodeListOf<HTMLDivElement> = fieldset.querySelectorAll<HTMLDivElement>('div[data-role="translation-tag"]');
        const translations: Entry[] = await EntryService.ReadAllByGlobalTranslation(entry);
        const newTranslationIds: number[] = [];

        for (const tag of tags) {
            const translation_id: number = Number(tag.querySelector<HTMLInputElement>('input#translation_id')!.value);
            newTranslationIds.push(translation_id);
            const isBound: boolean = translations.some(loopedEntry => loopedEntry.GetId() == translation_id);
            if (isBound) continue;
            const translation: Entry = await EntryService.ReadOne(translation_id);
            await EntryService.BindToTranslation(entry, translation);
        }

        for (const translation of translations) {
            if (!newTranslationIds.includes(translation.GetId())) {
                await EntryService.UnbindFromTranslation(entry, translation);
            }
        }
    }

    public static async ProcessDefinitions(form: Element, entry: Entry) {
        const fieldset: HTMLDivElement = form.querySelector("#definitions-section")!;
        const definitionItems: NodeListOf<HTMLDivElement> = fieldset.querySelectorAll<HTMLDivElement>('div[data-role="definition"]');
        const definitions: Definition[] = await DefinitionService.ReadAllByEntry(entry);
        const newDefinitionIds: number[] = [];

        for (const definitionItem of definitionItems) {
            const definition_id: number = Number(definitionItem.querySelector<HTMLInputElement>('input#definition_id')!.value);
            let definition: Definition;

            if (definition_id === 0) {
                const text: string = definitionItem.querySelector<HTMLTextAreaElement>('textarea#d-content')!.value;

                definition = new Definition(0, text);
                if (!definition.Validate()) throw new Error(`Unable to validate entry: ${definition}`);
                definition.Normalize();
                const [success, savedDefinition] = await DefinitionService.Save(definition);

                if (!success || !savedDefinition) {
                    console.warn('Sauvegarde échoué : ', text);
                    continue;
                }

                definition = savedDefinition;
            } else {
                definition = await DefinitionService.ReadOne(definition_id);
            }
            newDefinitionIds.push(Number(definition.GetId()));

            const isBound: boolean = definitions.some(loopedDefinition => loopedDefinition.GetId() == definition.GetId());
            if (!isBound) {
                await DefinitionService.BindToTranslation(definition, entry);
            }

            const translationContainer: HTMLDivElement = definitionItem.querySelector<HTMLDivElement>('div#d-translation-items')!;
            if (translationContainer) {
                const tags: NodeListOf<HTMLDivElement> = translationContainer.querySelectorAll<HTMLDivElement>('div[data-role="translation-tag"]');
                let translations: Entry[] = await EntryService.ReadAllByLocalTranslation(definition);
                translations = translations.filter(loopedEntry => loopedEntry.GetId() != entry.GetId());
                const newTranslationIds: number[] = [];

                for (const tag of tags) {
                    const translation_id: number = Number(tag.querySelector<HTMLInputElement>('input#translation_id')!.value);
                    newTranslationIds.push(translation_id);

                    const isBound: boolean = translations.some(loopedTranslation => loopedTranslation.GetId() == translation_id);
                    if (!isBound) {
                        const translation: Entry = await EntryService.ReadOne(translation_id);
                        await DefinitionService.BindToTranslation(definition, translation);
                    }
                }

                for (const translation of translations) {
                    if (!newTranslationIds.includes(translation.GetId())) {
                        await DefinitionService.UnbindFromTranslation(definition, entry);
                    }
                }
            }
        }

        for (const definition of definitions) {
            if (!newDefinitionIds.includes(definition.GetId())) {
                await DefinitionService.UnbindFromTranslation(definition, entry);

                const relatedEntries: Entry[] = await EntryService.ReadAllByLocalTranslation(definition);

                if (relatedEntries.length === 0) {
                    await DefinitionService.Delete(definition);
                }
            }
        }
    }
}