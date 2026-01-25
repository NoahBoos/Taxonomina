import {ipcMain} from "electron";
import {GrammaticalClassRepository} from "../database/repositories/GrammaticalClassRepository";
import {I_GrammaticalClass} from "../../shared/interfaces/I_GrammaticalClass";

export function registerGrammaticalClassIPCHandlers() {
    ipcMain.handle("txnmAPI:repositories:grammaticalClass:readAll", (_, dictionary_id: number) => {
        return GrammaticalClassRepository.readAll(dictionary_id);
    });

    ipcMain.handle("txnmAPI:repositories:grammaticalClass:readAllByEntry", (_, entry_id: number) => {
    return GrammaticalClassRepository.readAllByEntry(entry_id);
    });

    ipcMain.handle("txnmAPI:repositories:grammaticalClass:readOne", (_, grammatical_class_id: number) => {
        return GrammaticalClassRepository.readOne(grammatical_class_id);
    });

    ipcMain.handle("txnmAPI:repositories:grammaticalClass:create", (_, grammatical_class: I_GrammaticalClass) => {
        return GrammaticalClassRepository.create(grammatical_class);
    });

    ipcMain.handle("txnmAPI:repositories:grammaticalClass:update", (_, grammatical_class: I_GrammaticalClass) => {
        return GrammaticalClassRepository.update(grammatical_class);
    });

    ipcMain.handle("txnmAPI:repositories:grammaticalClass:delete", (_, grammatical_class_id: number) => {
        return GrammaticalClassRepository.delete(grammatical_class_id);
    });
}