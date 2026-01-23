import {ipcMain} from "electron";
import {Language} from "../database/models/Language";
import {LanguageRepository} from "../database/repositories/LanguageRepository";
import {I_Language} from "../../shared/interfaces/I_Language";

export function registerLanguageIPCHandlers() {
    ipcMain.handle("txnmAPI:repositories:language:readAll", (_, dictionary_id: number) => {
        return LanguageRepository.readAll(dictionary_id);
    });

    ipcMain.handle("txnmAPI:repositories:language:readOne", (_, language_id: number) => {
        return LanguageRepository.readOne(language_id);
    });

    ipcMain.handle("txnmAPI:repositories:language:create", (_, language: I_Language) => {
        return LanguageRepository.create(language);
    });

    ipcMain.handle("txnmAPI:repositories:language:update", (_, language: I_Language) => {
        return LanguageRepository.update(language);
    });

    ipcMain.handle("txnmAPI:repositories:language:delete", (_, language_id: number) => {
        return LanguageRepository.delete(language_id);
    });
}