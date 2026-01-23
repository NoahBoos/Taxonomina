import {I_Entry} from "@/shared/interfaces/I_Entry";
import {I_Definition} from "@/shared/interfaces/I_Definition";
import {I_GrammaticalClass} from "@/shared/interfaces/I_GrammaticalClass";
import {I_GrammaticalGenre} from "@/shared/interfaces/I_GrammaticalGenre";

export class EntryService {
    public static async ReadAll(dictionary_id: number): Promise<I_Entry[]> {
        return await window.txnmAPI.repositories.entry.readAll(dictionary_id);
    }

    public static async ReadAllByGlobalTranslation(entry: I_Entry): Promise<I_Entry[]> {
        return await window.txnmAPI.repositories.entry.readAllByGlobalTranslation(entry.id);
    }

    public static async ReadAllByLocalTranslation(definition: I_Definition): Promise<I_Entry[]> {
        return await window.txnmAPI.repositories.entry.readAllByLocalTranslation(definition.id);
    }

    public static async ReadOne(entry_id: number): Promise<I_Entry> {
        return await window.txnmAPI.repositories.entry.readOne(entry_id);
    }

    public static async Save(entry: I_Entry): Promise<[boolean, I_Entry | undefined]> {
        let [success, savedEntry] = entry.id == 0
            ? await window.txnmAPI.repositories.entry.create(entry)
            : await window.txnmAPI.repositories.entry.update(entry);
        return [success, savedEntry];
    }

    public static async Delete(entry: I_Entry): Promise<boolean> {
        return await window.txnmAPI.repositories.entry.delete(entry.id);
    }

    public static async BindToGrammaticalClass(entry: I_Entry, grammaticalClass: I_GrammaticalClass) {
        return await window.txnmAPI.repositories.entry.bindToGrammaticalClass(entry.id, grammaticalClass.id);
    }

    public static async UnbindFromGrammaticalClass(entry: I_Entry, grammaticalClass: I_GrammaticalClass) {
        return await window.txnmAPI.repositories.entry.unbindFromGrammaticalClass(entry.id, grammaticalClass.id);
    }

    public static async BindToGrammaticalGenre(entry: I_Entry, grammatical_genre: I_GrammaticalGenre) {
        return await window.txnmAPI.repositories.entry.bindToGrammaticalGenre(entry.id, grammatical_genre.id);
    }

    public static async UnbindFromGrammaticalGenre(entry: I_Entry, grammatical_genre: I_GrammaticalGenre) {
        return await window.txnmAPI.repositories.entry.unbindFromGrammaticalGenre(entry.id, grammatical_genre.id);
    }

    public static async BindToTranslation(entry: I_Entry, translation: I_Entry) {
        return await window.txnmAPI.repositories.entry.bindToTranslation(entry.id, translation.id);
    }

    public static async UnbindFromTranslation(entry: I_Entry, translation: I_Entry) {
        return await window.txnmAPI.repositories.entry.unbindFromTranslation(entry.id, translation.id);
    }

    // public static async FilterBySearch(dictionary_id: number, query: string): Promise<Entry[]> {
    //     const entries: Entry[] = await EntryService.ReadAll(dictionary_id);
    //     return entries.filter(entry => {
    //         return [entry.GetLemma()].some(value => value.toLowerCase().includes(query.toLowerCase()));
    //     });
    // }
    //
    // public static async ProcessForm(form: Element) {
    //     await DatabaseService.BeginTransaction();
    //     try {
    //         const [success, entry] = await EntryService.ProcessEntry(form);
    //         console.log("Entry added successfully.");
    //         if (success && entry) {
    //             await EntryService.ProcessGrammaticalCategories(form, entry);
    //             console.log("Grammatical categories processed successfully.");
    //             await EntryService.ProcessGrammaticalGenres(form, entry);
    //             console.log("Grammatical genres processed successfully.");
    //             await EntryService.ProcessGlobalTranslations(form, entry);
    //             console.log("Global translations processed successfully.");
    //             await EntryService.ProcessDefinitions(form, entry);
    //             console.log("Definitions processed successfully.");
    //             await DatabaseService.CommitTransaction();
    //             return entry;
    //         }
    //     } catch (error) {
    //         await DatabaseService.RollbackTransaction();
    //     }
    // }
    //
    // public static async ProcessEntry(form: Element): Promise<[boolean, Entry | undefined]> {
    //     const settings: I_TaxonominaSettings = await window.txnmAPI.settings.Load();
    //     const fieldset: HTMLDivElement = form.querySelector("#lemma-section")!;
    //     const id: number = parseInt(fieldset.querySelector<HTMLInputElement>("input#entry_id")!.value);
    //     const lemma: string = fieldset.querySelector<HTMLInputElement>("input#lemma")!.value;
    //     const language_id: number = parseInt(fieldset.querySelector<HTMLSelectElement>("select#language")!.value);
    //     const entry = new Entry(id, settings.currentDictionary, language_id, lemma);
    //     if (!entry.Validate()) throw new Error(`Unable to validate entry: ${entry}`);
    //     entry.Normalize();
    //     return await EntryService.Save(entry);
    // }
    //
    // public static async ProcessGrammaticalCategories(form: Element, entry: Entry) {
    //     const fieldset: HTMLDivElement = form.querySelector("#grammatical-categories")!;
    //     const checkboxes: NodeListOf<HTMLInputElement> = fieldset.querySelectorAll<HTMLInputElement>('input[name="grammatical-grammaticalClass"]');
    //     const entryCategories: GrammaticalClass[] = await GrammaticalClassService.ReadAllByEntry(entry);
    //
    //     for (const checkbox of checkboxes) {
    //         // TODO : Récupération via mapping des catégories, pour éviter les surcharges sur la BDD.
    //         const grammaticalClass: GrammaticalClass = await GrammaticalClassService.ReadOne(Number(checkbox.value));
    //         const isBound: boolean = entryCategories.some(loopedClass => loopedClass.GetId() == grammaticalClass.GetId());
    //         if (checkbox.checked) {
    //             if (isBound) continue;
    //             await EntryService.BindToGrammaticalClass(entry, grammaticalClass);
    //         } else {
    //             if (!isBound) continue;
    //             await EntryService.UnbindFromGrammaticalClass(entry, grammaticalClass);
    //         }
    //     }
    // }
    //
    // public static async ProcessGrammaticalGenres(form: Element, entry: Entry) {
    //     const fieldset: HTMLDivElement = form.querySelector("#grammatical-genres")!;
    //     const checkboxes: NodeListOf<HTMLInputElement> = fieldset.querySelectorAll<HTMLInputElement>('input[name="grammatical-genre"]');
    //     const entryGenres: GrammaticalGenre[] = await GrammaticalGenreService.ReadAllByEntry(entry);
    //
    //     for (const checkbox of checkboxes) {
    //         // TODO : Récupération via mapping des genres, pour éviter les surcharges sur la BDD.
    //         const genre: GrammaticalGenre = await GrammaticalGenreService.ReadOne(Number(checkbox.value));
    //         const isBound: boolean = entryGenres.some(loopedGenre => loopedGenre.GetId() == genre.GetId());
    //         if (checkbox.checked) {
    //             if (isBound) continue;
    //             await EntryService.BindToGrammaticalGenre(entry, genre);
    //         } else {
    //             if (!isBound) continue;
    //             await EntryService.UnbindFromGrammaticalGenre(entry, genre);
    //         }
    //     }
    // }
    //
    // public static async ProcessGlobalTranslations(form: Element, entry: Entry) {
    //     const fieldset: HTMLDivElement = form.querySelector("#global-translations-section")!;
    //     const tags: NodeListOf<HTMLDivElement> = fieldset.querySelectorAll<HTMLDivElement>('div[data-role="translation-tag"]');
    //     const translations: Entry[] = await EntryService.ReadAllByGlobalTranslation(entry);
    //     const newTranslationIds: number[] = [];
    //
    //     for (const tag of tags) {
    //         const translation_id: number = Number(tag.querySelector<HTMLInputElement>('input#translation_id')!.value);
    //         newTranslationIds.push(translation_id);
    //         const isBound: boolean = translations.some(loopedEntry => loopedEntry.GetId() == translation_id);
    //         if (isBound) continue;
    //         const translation: Entry = await EntryService.ReadOne(translation_id);
    //         await EntryService.BindToTranslation(entry, translation);
    //     }
    //
    //     for (const translation of translations) {
    //         if (!newTranslationIds.includes(translation.GetId())) {
    //             await EntryService.UnbindFromTranslation(entry, translation);
    //         }
    //     }
    // }
    //
    // public static async ProcessDefinitions(form: Element, entry: Entry) {
    //     const fieldset: HTMLDivElement = form.querySelector("#definitions-section")!;
    //     const definitionItems: NodeListOf<HTMLDivElement> = fieldset.querySelectorAll<HTMLDivElement>('div[data-role="definition"]');
    //     const definitions: Definition[] = await DefinitionService.ReadAllByEntry(entry);
    //     const newDefinitionIds: number[] = [];
    //
    //     for (const definitionItem of definitionItems) {
    //         const definition_id: number = Number(definitionItem.querySelector<HTMLInputElement>('input#definition_id')!.value);
    //         let definition: Definition;
    //
    //         if (definition_id === 0) {
    //             const text: string = definitionItem.querySelector<HTMLTextAreaElement>('textarea#d-content')!.value;
    //
    //             definition = new Definition(0, text);
    //             if (!definition.Validate()) throw new Error(`Unable to validate entry: ${definition}`);
    //             definition.Normalize();
    //             const [success, savedDefinition] = await DefinitionService.Save(definition);
    //
    //             if (!success || !savedDefinition) {
    //                 console.warn('Sauvegarde échoué : ', text);
    //                 continue;
    //             }
    //
    //             definition = savedDefinition;
    //         } else {
    //             definition = await DefinitionService.ReadOne(definition_id);
    //         }
    //         newDefinitionIds.push(Number(definition.GetId()));
    //
    //         const isBound: boolean = definitions.some(loopedDefinition => loopedDefinition.GetId() == definition.GetId());
    //         if (!isBound) {
    //             await DefinitionService.BindToTranslation(definition, entry);
    //         }
    //
    //         const translationContainer: HTMLDivElement = definitionItem.querySelector<HTMLDivElement>('div#d-translation-items')!;
    //         if (translationContainer) {
    //             const tags: NodeListOf<HTMLDivElement> = translationContainer.querySelectorAll<HTMLDivElement>('div[data-role="translation-tag"]');
    //             let translations: Entry[] = await EntryService.ReadAllByLocalTranslation(definition);
    //             translations = translations.filter(loopedEntry => loopedEntry.GetId() != entry.GetId());
    //             const newTranslationIds: number[] = [];
    //
    //             for (const tag of tags) {
    //                 const translation_id: number = Number(tag.querySelector<HTMLInputElement>('input#translation_id')!.value);
    //                 newTranslationIds.push(translation_id);
    //
    //                 const isBound: boolean = translations.some(loopedTranslation => loopedTranslation.GetId() == translation_id);
    //                 if (!isBound) {
    //                     const translation: Entry = await EntryService.ReadOne(translation_id);
    //                     await DefinitionService.BindToTranslation(definition, translation);
    //                 }
    //             }
    //
    //             for (const translation of translations) {
    //                 if (!newTranslationIds.includes(translation.GetId())) {
    //                     await DefinitionService.UnbindFromTranslation(definition, entry);
    //                 }
    //             }
    //         }
    //     }
    //
    //     for (const definition of definitions) {
    //         if (!newDefinitionIds.includes(definition.GetId())) {
    //             await DefinitionService.UnbindFromTranslation(definition, entry);
    //
    //             const relatedEntries: Entry[] = await EntryService.ReadAllByLocalTranslation(definition);
    //
    //             if (relatedEntries.length === 0) {
    //                 await DefinitionService.Delete(definition);
    //             }
    //         }
    //     }
    // }
}