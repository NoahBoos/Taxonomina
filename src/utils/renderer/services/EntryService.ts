import {Entry} from "../../../database/models/Entry";
import {Definition} from "../../../database/models/Definition";

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