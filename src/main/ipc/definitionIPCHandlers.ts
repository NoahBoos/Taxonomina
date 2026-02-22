import {ipcMain} from "electron";
import {DefinitionRepository} from "../database/repositories/DefinitionRepository";
import {I_Definition} from "../../shared/interfaces/I_Definition";

export function registerDefinitionIPCHandlers() {
    ipcMain.handle("txnmAPI:repositories:definition:readAll", () => {
        return DefinitionRepository.readAll();
    });

    ipcMain.handle("txnmAPI:repositories:definition:readAllByEntry", (_, entry_id: number) => {
        return DefinitionRepository.readAllByEntry(entry_id);
    });

    ipcMain.handle("txnmAPI:repositories:definition:readOne", (_, definition_id: number) => {
        return DefinitionRepository.readOne(definition_id);
    });

    ipcMain.handle("txnmAPI:repositories:definition:create", (_, definition: I_Definition) => {
        return DefinitionRepository.create(definition);
    });

    ipcMain.handle("txnmAPI:repositories:definition:update", (_, definition: I_Definition) => {
        return DefinitionRepository.update(definition);
    });

    ipcMain.handle("txnmAPI:repositories:definition:delete", (_, definition_id: number) => {
        return DefinitionRepository.delete(definition_id);
    });

    ipcMain.handle("txnmAPI:repositories:definition:bindToTranslation", (_, definition_id: number, translation_id: number) => {
        return DefinitionRepository.bindToTranslation(definition_id, translation_id);
    })

    ipcMain.handle("txnmAPI:repositories:definition:unbindFromTranslation", (_, definition_id: number, translation_id: number) => {
        return DefinitionRepository.unbindFromTranslation(definition_id, translation_id);
    })
}