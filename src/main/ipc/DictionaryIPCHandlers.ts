import {ipcMain} from "electron";
import {DictionaryRepository} from "../database/repositories/DictionaryRepository";
import {I_Dictionary} from "../../shared/interfaces/I_Dictionary";

export function RegisterDictionaryIPCHandlers() {
    ipcMain.handle("txnmAPI:repositories:dictionary:readAll", () => {
        return DictionaryRepository.readAll();
    });

    ipcMain.handle("txnmAPI:repositories:dictionary:readOne", (_, dictionary_id: number) => {
        return DictionaryRepository.readOne(dictionary_id);
    });

    ipcMain.handle("txnmAPI:repositories:dictionary:create", (_, dictionary: I_Dictionary) => {
        return DictionaryRepository.create(dictionary);
    });

    ipcMain.handle("txnmAPI:repositories:dictionary:update", (_, dictionary: I_Dictionary) => {
        return DictionaryRepository.update(dictionary);
    });

    ipcMain.handle("txnmAPI:repositories:dictionary:delete", (_, dictionary_id: number) => {
        return DictionaryRepository.delete(dictionary_id);
    });
}