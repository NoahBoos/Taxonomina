import {ipcMain} from "electron";
import {Entry} from "../../shared/models/Entry";
import {EntryRepository} from "../database/repositories/EntryRepository";
import {Definition} from "../../shared/models/Definition";
import {GrammaticalClass} from "../../shared/models/GrammaticalClass";
import {GrammaticalGenre} from "../../shared/models/GrammaticalGenre";

export function RegisterEntryIPCHandlers() {
    ipcMain.handle("txnmAPI:repositories:entry:readAll", (event, dictionary_id: number): Entry[] => {
        return EntryRepository.ReadAll(dictionary_id);
    });

    ipcMain.handle("txnmAPI:repositories:entry:readAllByGlobalTranslation", (event, rawEntry: Entry) => {
        const entry: Entry = Entry.Hydrate(rawEntry);
        return EntryRepository.ReadAllByGlobalTranslation(entry);
    });

    ipcMain.handle("txnmAPI:repositories:entry:readAllByLocalTranslation", (event, rawDefinition: Definition) => {
        const definition: Definition = Definition.Hydrate(rawDefinition);
        return EntryRepository.ReadAllByLocalTranslation(definition);
    })

    ipcMain.handle("txnmAPI:repositories:entry:readOne", (event, entryId: number) => {
        return EntryRepository.ReadOne(entryId);
    });

    ipcMain.handle("txnmAPI:repositories:entry:bindToGrammaticalClass", (event, rawEntry: Entry, rawClass: GrammaticalClass) => {
        const entry: Entry = Entry.Hydrate(rawEntry);
        const grammaticalClass: GrammaticalClass = GrammaticalClass.Hydrate(rawClass);
        return EntryRepository.BindToGrammaticalClass(entry, grammaticalClass);
    })

    ipcMain.handle("txnmAPI:repositories:entry:unbindFromGrammaticalClass", (event, rawEntry: Entry, rawClass: GrammaticalClass) => {
        const entry: Entry = Entry.Hydrate(rawEntry);
        const grammaticalClass: GrammaticalClass = GrammaticalClass.Hydrate(rawClass);
        return EntryRepository.UnbindFromGrammaticalClass(entry, grammaticalClass);
    })

    ipcMain.handle("txnmAPI:repositories:entry:bindToGrammaticalGenre", (event, rawEntry: Entry, rawGenre: GrammaticalGenre) => {
        const entry: Entry = Entry.Hydrate(rawEntry);
        const genre: GrammaticalGenre = GrammaticalGenre.Hydrate(rawGenre);
        return EntryRepository.BindToGrammaticalGenre(entry, genre);
    })

    ipcMain.handle("txnmAPI:repositories:entry:unbindFromGrammaticalGenre", (event, rawEntry: Entry, rawGenre: GrammaticalGenre) => {
        const entry: Entry = Entry.Hydrate(rawEntry);
        const genre: GrammaticalGenre = GrammaticalGenre.Hydrate(rawGenre);
        return EntryRepository.UnbindFromGrammaticalGenre(entry, genre);
    })

    ipcMain.handle("txnmAPI:repositories:entry:bindToTranslation", (event, rawEntry: Entry, rawTranslation: Entry) => {
        const entry: Entry = Entry.Hydrate(rawEntry);
        const translation: Entry = Entry.Hydrate(rawTranslation);
        return EntryRepository.BindToTranslation(entry, translation);
    })

    ipcMain.handle("txnmAPI:repositories:entry:unbindFromTranslation", (event, rawEntry: Entry, rawTranslation: Entry) => {
        const entry: Entry = Entry.Hydrate(rawEntry);
        const translation: Entry = Entry.Hydrate(rawTranslation);
        return EntryRepository.UnbindFromTranslation(entry, translation);
    })

    ipcMain.handle("txnmAPI:repositories:entry:create", (event, rawEntry: Entry) => {
        const entry: Entry = Entry.Hydrate(rawEntry);
        return EntryRepository.Create(entry);
    });

    ipcMain.handle("txnmAPI:repositories:entry:update", (event, rawEntry: Entry) => {
        const entry: Entry = Entry.Hydrate(rawEntry);
        return EntryRepository.Update(entry);
    });

    ipcMain.handle("txnmAPI:repositories:entry:delete", (event, rawEntry: Entry) => {
        const entry: Entry = Entry.Hydrate(rawEntry);
        return EntryRepository.Delete(entry);
    });
}