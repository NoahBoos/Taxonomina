import {ipcMain} from "electron";
import {DictionaryRepository} from "../database/repositories/DictionaryRepository";
import {Dictionary} from "../../shared/models/Dictionary";

export function RegisterDictionaryIPCHandlers() {
    ipcMain.handle("txnmAPI:repositories:dictionary:readAll", () => {
        return DictionaryRepository.ReadAll();
    });

    ipcMain.handle("txnmAPI:repositories:dictionary:readAllButOne", (event, rawDictionary: Dictionary) => {
        const dictionary: Dictionary = Dictionary.Hydrate(rawDictionary);
        return DictionaryRepository.ReadAllButOne(dictionary);
    })

    ipcMain.handle("txnmAPI:repositories:dictionary:readOne", (event, dictionaryId: number) => {
        return DictionaryRepository.ReadOne(dictionaryId);
    });

    ipcMain.handle("txnmAPI:repositories:dictionary:create", (event, rawDictionary: Dictionary) => {
        const dictionary: Dictionary = Dictionary.Hydrate(rawDictionary);
        return DictionaryRepository.Create(dictionary);
    });

    ipcMain.handle("txnmAPI:repositories:dictionary:update", (event, rawDictionary: Dictionary) => {
        const dictionary: Dictionary = Dictionary.Hydrate(rawDictionary);
        return DictionaryRepository.Update(dictionary);
    });

    ipcMain.handle("txnmAPI:repositories:dictionary:delete", (event, rawDictionary: Dictionary) => {
        const dictionary: Dictionary = Dictionary.Hydrate(rawDictionary);
        return DictionaryRepository.Delete(dictionary);
    });
}