import {ipcMain} from "electron";
import {Language} from "../database/models/Language";
import {LanguageRepository} from "../database/repositories/LanguageRepository";
import {I_Language} from "../../shared/interfaces/I_Language";

export function RegisterLanguageIPCHandlers() {
    ipcMain.handle("txnmAPI:repositories:language:readAll", (event, dictionary_id: number) => {
        return LanguageRepository.ReadAll(dictionary_id);
    });

    ipcMain.handle("txnmAPI:repositories:language:readOne", (event, languageId: number) => {
        return LanguageRepository.ReadOne(languageId);
    });

    ipcMain.handle("txnmAPI:repositories:language:create", (event, rawLanguage: I_Language) => {
        const language: Language = Language.Hydrate(rawLanguage);
        return LanguageRepository.Create(language);
    });

    ipcMain.handle("txnmAPI:repositories:language:update", (event, rawLanguage: I_Language) => {
        const language: Language = Language.Hydrate(rawLanguage);
        return LanguageRepository.Update(language);
    });

    ipcMain.handle("txnmAPI:repositories:language:delete", (event, rawLanguage: I_Language) => {
        const language: Language = Language.Hydrate(rawLanguage);
        return LanguageRepository.Delete(language);
    });
}