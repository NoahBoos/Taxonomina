import {ipcMain} from "electron";
import {Definition} from "../../shared/models/Definition";
import {DefinitionRepository} from "../database/repositories/DefinitionRepository";
import {Entry} from "../../shared/models/Entry";

export function RegisterDefinitionIPCHandlers() {
    ipcMain.handle("txnmAPI:repositories:definition:readAll", (): Definition[] => {
        return DefinitionRepository.ReadAll();
    });

    ipcMain.handle("txnmAPI:repositories:definition:readAllByEntry", (event, rawEntry: Entry) => {
        const entry: Entry = Entry.Hydrate(rawEntry);
        return DefinitionRepository.ReadAllByEntry(entry);
    });

    ipcMain.handle("txnmAPI:repositories:definition:readOne", (event, definitionId: number) => {
        return DefinitionRepository.ReadOne(definitionId);
    });

    ipcMain.handle("txnmAPI:repositories:definition:bindToTranslation", (event, rawDefinition: Definition, rawTranslation: Entry) => {
        const definition: Definition = Definition.Hydrate(rawDefinition);
        const translation: Entry = Entry.Hydrate(rawTranslation);
        return DefinitionRepository.BindToTranslation(definition, translation);
    })

    ipcMain.handle("txnmAPI:repositories:definition:unbindFromTranslation", (event, rawDefinition: Definition, rawTranslation: Entry) => {
        const definition: Definition = Definition.Hydrate(rawDefinition);
        const translation: Entry = Entry.Hydrate(rawTranslation);
        return DefinitionRepository.UnbindFromTranslation(definition, translation);
    })

    ipcMain.handle("txnmAPI:repositories:definition:create", (event, rawDefinition: Definition) => {
        const definition: Definition = Definition.Hydrate(rawDefinition)
        return DefinitionRepository.Create(definition);
    });

    ipcMain.handle("txnmAPI:repositories:definition:update", (event, rawDefinition: Definition) => {
        const definition: Definition = Definition.Hydrate(rawDefinition)
        return DefinitionRepository.Update(definition);
    });

    ipcMain.handle("txnmAPI:repositories:definition:delete", (event, rawDefinition: Definition) => {
        const definition: Definition = Definition.Hydrate(rawDefinition)
        return DefinitionRepository.Delete(definition);
    });
}