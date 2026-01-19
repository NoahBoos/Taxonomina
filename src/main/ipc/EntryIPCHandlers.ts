import {ipcMain} from "electron";
import {Entry} from "../database/models/Entry";
import {EntryRepository} from "../database/repositories/EntryRepository";
import {Definition} from "../database/models/Definition";
import {GrammaticalClass} from "../database/models/GrammaticalClass";
import {GrammaticalGenre} from "../database/models/GrammaticalGenre";
import {I_Entry} from "../../shared/interfaces/I_Entry";
import {I_GrammaticalClass} from "../../shared/interfaces/I_GrammaticalClass";
import {I_GrammaticalGenre} from "../../shared/interfaces/I_GrammaticalGenre";
import {I_Definition} from "../../shared/interfaces/I_Definition";

export function RegisterEntryIPCHandlers() {
    ipcMain.handle("txnmAPI:repositories:entry:readAll", (event, dictionary_id: number) => {
        return EntryRepository.ReadAll(dictionary_id);
    });

    ipcMain.handle("txnmAPI:repositories:entry:readAllByGlobalTranslation", (event, rawEntry: I_Entry) => {
        const entry: Entry = Entry.Hydrate(rawEntry);
        return EntryRepository.ReadAllByGlobalTranslation(entry);
    });

    ipcMain.handle("txnmAPI:repositories:entry:readAllByLocalTranslation", (event, rawDefinition: I_Definition) => {
        const definition: Definition = Definition.hydrate(rawDefinition);
        return EntryRepository.ReadAllByLocalTranslation(definition);
    })

    ipcMain.handle("txnmAPI:repositories:entry:readOne", (event, entryId: number) => {
        return EntryRepository.ReadOne(entryId);
    });

    ipcMain.handle("txnmAPI:repositories:entry:bindToGrammaticalClass", (event, rawEntry: I_Entry, rawClass: I_GrammaticalClass) => {
        const entry: Entry = Entry.Hydrate(rawEntry);
        const grammaticalClass: GrammaticalClass = GrammaticalClass.Hydrate(rawClass);
        return EntryRepository.BindToGrammaticalClass(entry, grammaticalClass);
    })

    ipcMain.handle("txnmAPI:repositories:entry:unbindFromGrammaticalClass", (event, rawEntry: I_Entry, rawClass: I_GrammaticalClass) => {
        const entry: Entry = Entry.Hydrate(rawEntry);
        const grammaticalClass: GrammaticalClass = GrammaticalClass.Hydrate(rawClass);
        return EntryRepository.UnbindFromGrammaticalClass(entry, grammaticalClass);
    })

    ipcMain.handle("txnmAPI:repositories:entry:bindToGrammaticalGenre", (event, rawEntry: I_Entry, rawGenre: I_GrammaticalGenre) => {
        const entry: Entry = Entry.Hydrate(rawEntry);
        const genre: GrammaticalGenre = GrammaticalGenre.Hydrate(rawGenre);
        return EntryRepository.BindToGrammaticalGenre(entry, genre);
    })

    ipcMain.handle("txnmAPI:repositories:entry:unbindFromGrammaticalGenre", (event, rawEntry: I_Entry, rawGenre: I_GrammaticalGenre) => {
        const entry: Entry = Entry.Hydrate(rawEntry);
        const genre: GrammaticalGenre = GrammaticalGenre.Hydrate(rawGenre);
        return EntryRepository.UnbindFromGrammaticalGenre(entry, genre);
    })

    ipcMain.handle("txnmAPI:repositories:entry:bindToTranslation", (event, rawEntry: I_Entry, rawTranslation: I_Entry) => {
        const entry: Entry = Entry.Hydrate(rawEntry);
        const translation: Entry = Entry.Hydrate(rawTranslation);
        return EntryRepository.BindToTranslation(entry, translation);
    })

    ipcMain.handle("txnmAPI:repositories:entry:unbindFromTranslation", (event, rawEntry: I_Entry, rawTranslation: I_Entry) => {
        const entry: Entry = Entry.Hydrate(rawEntry);
        const translation: Entry = Entry.Hydrate(rawTranslation);
        return EntryRepository.UnbindFromTranslation(entry, translation);
    })

    ipcMain.handle("txnmAPI:repositories:entry:create", (event, rawEntry: I_Entry) => {
        const entry: Entry = Entry.Hydrate(rawEntry);
        return EntryRepository.Create(entry);
    });

    ipcMain.handle("txnmAPI:repositories:entry:update", (event, rawEntry: I_Entry) => {
        const entry: Entry = Entry.Hydrate(rawEntry);
        return EntryRepository.Update(entry);
    });

    ipcMain.handle("txnmAPI:repositories:entry:delete", (event, rawEntry: I_Entry) => {
        const entry: Entry = Entry.Hydrate(rawEntry);
        return EntryRepository.Delete(entry);
    });
}