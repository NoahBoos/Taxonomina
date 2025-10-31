import {Entry} from "../../../database/models/Entry";
import {Definition} from "../../../database/models/Definition";
import {TaxonominaSettings} from "../../../interfaces/I_TaxonominaSettings";
import {GrammaticalCategory} from "../../../database/models/GrammaticalCategory";
import {GrammaticalGenre} from "../../../database/models/GrammaticalGenre";
import {GrammaticalCategoryService} from "./GrammaticalCategoryService";
import {GrammaticalGenreService} from "./GrammaticalGenreService";

export class EntryService {
    public static async ReadAll(): Promise<Entry[]> {
        const rawEntries: Entry[] = await window.txnmAPI.repositories.entry.ReadAll();
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

    public static async Save(entry: Entry): Promise<[boolean, Entry | undefined]> {
        let [success, savedEntry] = entry.GetId() == 0
            ? await window.txnmAPI.repositories.entry.Create(entry)
            : await window.txnmAPI.repositories.entry.Update(entry);
        return [success, Entry.Hydrate(savedEntry)];
    }

    public static async Delete(entry: Entry): Promise<boolean> {
        return await window.txnmAPI.repositories.entry.Delete(entry);
    }

    public static async ProcessForm(form: Element) {
        const [success, entry] = await EntryService.ProcessEntry(form);
        console.log("Thrown ID : " + entry?.GetId());
        if (success && entry) {
            await EntryService.ProcessGrammaticalCategories(form, entry);
            await EntryService.ProcessGrammaticalGenres(form, entry);
        }
    }

    public static async ProcessEntry(form: Element) {
        const settings: TaxonominaSettings = await window.txnmAPI.settings.Load();
        const fieldset: HTMLFieldSetElement = form.querySelector<HTMLFieldSetElement>("fieldset#lemma-section")!;
        const entryId: number = parseInt(fieldset.querySelector<HTMLInputElement>("input#entry_id")!.value);
        console.log("VALUE : " + entryId);
        const lemma: string = fieldset.querySelector<HTMLInputElement>("input#lemma")!.value;
        const languageId: number = parseInt(fieldset.querySelector<HTMLSelectElement>("select#language")!.value);
        const entry = new Entry(entryId, settings.currentDictionary, languageId, lemma);
        console.log("ENTRY TO ADD : " + entry.GetId());
        return await EntryService.Save(entry);
    }

    public static async ProcessGrammaticalCategories(form: Element, entry: Entry) {
        const fieldset: HTMLFieldSetElement = form.querySelector<HTMLFieldSetElement>("fieldset#grammatical-categories")!;
        const checkboxes: NodeListOf<HTMLInputElement> = fieldset.querySelectorAll<HTMLInputElement>('input[name="grammatical-category"]');
        const entryCategories: GrammaticalCategory[] = await GrammaticalCategoryService.ReadAllByEntry(entry);

        for (const checkbox of checkboxes) {
            console.log("Tentative de gestion d'une catégorie grammaticale déclenchée.");
            // TODO : Récupération via mapping des catégories, pour éviter les surcharges sur la BDD.
            const category: GrammaticalCategory = await GrammaticalCategoryService.ReadOne(Number(checkbox.value));
            const isBound: boolean = entryCategories.some(loopedCategory => loopedCategory.GetId() == category.GetId());
            if (checkbox.checked) {
                if (isBound) continue;
                console.log("CATEGORY : " + category.GetId());
                console.log("ENTRY : " + entry.GetId());
                await EntryService.BindToGrammaticalCategory(entry, category);
                console.log("Lien créé.");
            } else {
                if (!isBound) continue;
                await EntryService.UnbindFromGrammaticalCategory(entry, category);
                console.log("Lien supprimé.");
            }
            console.log("Tentative de gestion d'une catégorie grammaticale terminée.");
        }
    }

    public static async ProcessGrammaticalGenres(form: Element, entry: Entry) {
        const fieldset: HTMLFieldSetElement = form.querySelector<HTMLFieldSetElement>("fieldset#grammatical-genres")!;
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
}