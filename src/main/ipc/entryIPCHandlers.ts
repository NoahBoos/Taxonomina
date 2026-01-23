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

export function registerEntryIPCHandlers() {
    ipcMain.handle("txnmAPI:repositories:entry:readAll", (_, dictionary_id: number) => {
        return EntryRepository.readAll(dictionary_id);
    });

    ipcMain.handle("txnmAPI:repositories:entry:readAllByGlobalTranslation", (_, entry_id: number) => {
        return EntryRepository.readAllByGlobalTranslation(entry_id);
    });

    ipcMain.handle("txnmAPI:repositories:entry:readAllByLocalTranslation", (_, definition_id: number) => {
        return EntryRepository.readAllByLocalTranslation(definition_id);
    })

    ipcMain.handle("txnmAPI:repositories:entry:readOne", (_, entry_id: number) => {
        return EntryRepository.readOne(entry_id);
    });

    ipcMain.handle("txnmAPI:repositories:entry:create", (_, entry: I_Entry) => {
        return EntryRepository.create(entry);
    });

    ipcMain.handle("txnmAPI:repositories:entry:update", (_, entry: I_Entry) => {
        return EntryRepository.update(entry);
    });

    ipcMain.handle("txnmAPI:repositories:entry:delete", (_, entry_id: number) => {
        return EntryRepository.delete(entry_id);
    });

    ipcMain.handle("txnmAPI:repositories:entry:bindToGrammaticalClass", (_, entry_id: number, grammatical_class_id: number) => {
        return EntryRepository.bindToGrammaticalClass(entry_id, grammatical_class_id);
    });

    ipcMain.handle("txnmAPI:repositories:entry:unbindFromGrammaticalClass", (_, entry_id: number, grammatical_class_id: number) => {
        return EntryRepository.unbindFromGrammaticalClass(entry_id, grammatical_class_id);
    });

    ipcMain.handle("txnmAPI:repositories:entry:bindToGrammaticalGenre", (_, entry_id: number, grammatical_genre_id: number) => {
        return EntryRepository.bindToGrammaticalGenre(entry_id, grammatical_genre_id);
    });

    ipcMain.handle("txnmAPI:repositories:entry:unbindFromGrammaticalGenre", (_, entry_id: number, grammatical_genre_id: number) => {
        return EntryRepository.unbindFromGrammaticalGenre(entry_id, grammatical_genre_id);
    });

    ipcMain.handle("txnmAPI:repositories:entry:bindToTranslation", (_, entry_id: number, translation_id: number) => {
        return EntryRepository.bindToTranslation(entry_id, translation_id);
    });

    ipcMain.handle("txnmAPI:repositories:entry:unbindFromTranslation", (_, entry_id: number, translation_id: number) => {
        return EntryRepository.unbindFromTranslation(entry_id, translation_id);
    });
}