import {ipcMain} from "electron";
import {Language} from "../../shared/models/Language";
import {LanguageRepository} from "../database/repositories/LanguageRepository";

export function RegisterLanguageIPCHandlers() {
    ipcMain.handle("txnmAPI:repositories:language:readAll", (event, dictionary_id: number): Language[] => {
        return LanguageRepository.ReadAll(dictionary_id);
    });

    ipcMain.handle("txnmAPI:repositories:language:readOne", (event, languageId: number) => {
        return LanguageRepository.ReadOne(languageId);
    });

    ipcMain.handle("txnmAPI:repositories:language:create", (event, rawLanguage: Language) => {
        const language: Language = Language.Hydrate(rawLanguage);
        return LanguageRepository.Create(language);
    });

    ipcMain.handle("txnmAPI:repositories:language:update", (event, rawLanguage: Language) => {
        const language: Language = Language.Hydrate(rawLanguage);
        return LanguageRepository.Update(language);
    });

    ipcMain.handle("txnmAPI:repositories:language:delete", (event, rawLanguage: Language) => {
        const language: Language = Language.Hydrate(rawLanguage);
        return LanguageRepository.Delete(language);
    });
}