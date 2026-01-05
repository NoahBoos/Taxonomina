import {ipcMain} from "electron";
import {GrammaticalClass} from "../../shared/models/GrammaticalClass";
import {GrammaticalClassRepository} from "../database/repositories/GrammaticalClassRepository";
import {Entry} from "../../shared/models/Entry";

export function RegisterGrammaticalClassIPCHandlers() {
    ipcMain.handle("txnmAPI:repositories:grammaticalClass:readAll", (event, dictionary_id: number): GrammaticalClass[] => {
        return GrammaticalClassRepository.ReadAll(dictionary_id);
    });

    ipcMain.handle("txnmAPI:repositories:grammaticalClass:readAllByEntry", (event, rawEntry: Entry): GrammaticalClass[] => {
        const entry: Entry = Entry.Hydrate(rawEntry);
        return GrammaticalClassRepository.ReadAllByEntry(entry);
    });

    ipcMain.handle("txnmAPI:repositories:grammaticalClass:readOne", (event, grammaticalClassId: number) => {
        return GrammaticalClassRepository.ReadOne(grammaticalClassId);
    });

    ipcMain.handle("txnmAPI:repositories:grammaticalClass:create", (event, rawGrammaticalClass: GrammaticalClass) => {
        const gramCat: GrammaticalClass = GrammaticalClass.Hydrate(rawGrammaticalClass)
        return GrammaticalClassRepository.Create(gramCat);
    });

    ipcMain.handle("txnmAPI:repositories:grammaticalClass:update", (event, rawGrammaticalClass: GrammaticalClass) => {
        const gramCat: GrammaticalClass = GrammaticalClass.Hydrate(rawGrammaticalClass)
        return GrammaticalClassRepository.Update(gramCat);
    });

    ipcMain.handle("txnmAPI:repositories:grammaticalClass:delete", (event, rawGrammaticalClass: GrammaticalClass) => {
        const gramCat: GrammaticalClass = GrammaticalClass.Hydrate(rawGrammaticalClass)
        return GrammaticalClassRepository.Delete(gramCat);
    });
}