import {ipcMain} from "electron";
import {Definition} from "../database/models/Definition";
import {DefinitionRepository} from "../database/repositories/DefinitionRepository";
import {Entry} from "../database/models/Entry";
import {I_Definition} from "../../shared/interfaces/I_Definition";
import {I_Entry} from "../../shared/interfaces/I_Entry";

export function RegisterDefinitionIPCHandlers() {
    ipcMain.handle("txnmAPI:repositories:definition:readAll", () => {
        return DefinitionRepository.ReadAll();
    });

    ipcMain.handle("txnmAPI:repositories:definition:readAllByEntry", (event, rawEntry: I_Entry) => {
        const entry: Entry = Entry.Hydrate(rawEntry);
        return DefinitionRepository.ReadAllByEntry(entry);
    });

    ipcMain.handle("txnmAPI:repositories:definition:readOne", (event, definitionId: number) => {
        return DefinitionRepository.ReadOne(definitionId);
    });

    ipcMain.handle("txnmAPI:repositories:definition:bindToTranslation", (event, rawDefinition: I_Definition, rawTranslation: I_Entry) => {
        const definition: Definition = Definition.hydrate(rawDefinition);
        const translation: Entry = Entry.Hydrate(rawTranslation);
        return DefinitionRepository.BindToTranslation(definition, translation);
    })

    ipcMain.handle("txnmAPI:repositories:definition:unbindFromTranslation", (event, rawDefinition: I_Definition, rawTranslation: I_Entry) => {
        const definition: Definition = Definition.hydrate(rawDefinition);
        const translation: Entry = Entry.Hydrate(rawTranslation);
        return DefinitionRepository.UnbindFromTranslation(definition, translation);
    })

    ipcMain.handle("txnmAPI:repositories:definition:create", (event, rawDefinition: I_Definition) => {
        const definition: Definition = Definition.hydrate(rawDefinition)
        return DefinitionRepository.Create(definition);
    });

    ipcMain.handle("txnmAPI:repositories:definition:update", (event, rawDefinition: I_Definition) => {
        const definition: Definition = Definition.hydrate(rawDefinition)
        return DefinitionRepository.Update(definition);
    });

    ipcMain.handle("txnmAPI:repositories:definition:delete", (event, rawDefinition: I_Definition) => {
        const definition: Definition = Definition.hydrate(rawDefinition)
        return DefinitionRepository.Delete(definition);
    });
}