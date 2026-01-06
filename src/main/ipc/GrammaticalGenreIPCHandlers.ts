import {ipcMain} from "electron";
import {GrammaticalGenre} from "../database/models/GrammaticalGenre";
import {GrammaticalGenreRepository} from "../database/repositories/GrammaticalGenreRepository";
import {Entry} from "../database/models/Entry";
import {I_Entry} from "../../shared/interfaces/I_Entry";
import {I_GrammaticalGenre} from "../../shared/interfaces/I_GrammaticalGenre";

export function RegisterGrammaticalGenreIPCHandlers() {
    ipcMain.handle("txnmAPI:repositories:grammaticalGenre:readAll", (event, dictionary_id: number) => {
        return GrammaticalGenreRepository.ReadAll(dictionary_id);
    });

    ipcMain.handle("txnmAPI:repositories:grammaticalGenre:readAllByEntry", (event, rawEntry: I_Entry) => {
        const entry: Entry = Entry.Hydrate(rawEntry);
        return GrammaticalGenreRepository.ReadAllByEntry(entry);
    });

    ipcMain.handle("txnmAPI:repositories:grammaticalGenre:readOne", (event, gramGenreId: number) => {
        return GrammaticalGenreRepository.ReadOne(gramGenreId);
    });

    ipcMain.handle("txnmAPI:repositories:grammaticalGenre:create", (event, rawGramGenre: I_GrammaticalGenre) => {
        const gramGenre: GrammaticalGenre = GrammaticalGenre.Hydrate(rawGramGenre)
        return GrammaticalGenreRepository.Create(gramGenre);
    });

    ipcMain.handle("txnmAPI:repositories:grammaticalGenre:update", (event, rawGramGenre: I_GrammaticalGenre) => {
        const gramGenre: GrammaticalGenre = GrammaticalGenre.Hydrate(rawGramGenre)
        return GrammaticalGenreRepository.Update(gramGenre);
    });

    ipcMain.handle("txnmAPI:repositories:grammaticalGenre:delete", (event, rawGramGenre: I_GrammaticalGenre) => {
        const gramGenre: GrammaticalGenre = GrammaticalGenre.Hydrate(rawGramGenre)
        return GrammaticalGenreRepository.Delete(gramGenre);
    });
}