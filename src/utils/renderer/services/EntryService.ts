import {Entry} from "../../../database/models/Entry";
import {Definition} from "../../../database/models/Definition";
import {SettingManager} from "../../main/SettingManager";
import {TaxonominaSettings} from "../../../interfaces/I_TaxonominaSettings";
import {LanguageService} from "./LanguageService";
import {GrammaticalCategory} from "../../../database/models/GrammaticalCategory";
import {GrammaticalGenre} from "../../../database/models/GrammaticalGenre";

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
}