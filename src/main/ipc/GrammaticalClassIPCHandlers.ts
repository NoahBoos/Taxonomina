import {ipcMain} from "electron";
import {GrammaticalClass} from "../database/models/GrammaticalClass";
import {GrammaticalClassRepository} from "../database/repositories/GrammaticalClassRepository";
import {Entry} from "../database/models/Entry";
import {I_Entry} from "../../shared/interfaces/I_Entry";
import {I_GrammaticalClass} from "../../shared/interfaces/I_GrammaticalClass";

export function RegisterGrammaticalClassIPCHandlers() {
    ipcMain.handle("txnmAPI:repositories:grammaticalClass:readAll", (event, dictionary_id: number) => {
        return GrammaticalClassRepository.ReadAll(dictionary_id);
    });

    ipcMain.handle("txnmAPI:repositories:grammaticalClass:readAllByEntry", (event, rawEntry: I_Entry) => {
        const entry: Entry = Entry.hydrate(rawEntry);
        return GrammaticalClassRepository.ReadAllByEntry(entry);
    });

    ipcMain.handle("txnmAPI:repositories:grammaticalClass:readOne", (event, grammaticalClassId: number) => {
        return GrammaticalClassRepository.ReadOne(grammaticalClassId);
    });

    ipcMain.handle("txnmAPI:repositories:grammaticalClass:create", (event, rawGrammaticalClass: I_GrammaticalClass) => {
        const gramCat: GrammaticalClass = GrammaticalClass.Hydrate(rawGrammaticalClass)
        return GrammaticalClassRepository.Create(gramCat);
    });

    ipcMain.handle("txnmAPI:repositories:grammaticalClass:update", (event, rawGrammaticalClass: I_GrammaticalClass) => {
        const gramCat: GrammaticalClass = GrammaticalClass.Hydrate(rawGrammaticalClass)
        return GrammaticalClassRepository.Update(gramCat);
    });

    ipcMain.handle("txnmAPI:repositories:grammaticalClass:delete", (event, rawGrammaticalClass: I_GrammaticalClass) => {
        const gramCat: GrammaticalClass = GrammaticalClass.Hydrate(rawGrammaticalClass)
        return GrammaticalClassRepository.Delete(gramCat);
    });
}