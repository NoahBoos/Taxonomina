import {ipcMain} from "electron";
import {GrammaticalGenre} from "../../shared/models/GrammaticalGenre";
import {GrammaticalGenreRepository} from "../database/repositories/GrammaticalGenreRepository";
import {Entry} from "../../shared/models/Entry";

export function RegisterGrammaticalGenreIPCHandlers() {
    ipcMain.handle("txnmAPI:repositories:grammaticalGenre:readAll", (event, dictionary_id: number): GrammaticalGenre[] => {
        return GrammaticalGenreRepository.ReadAll(dictionary_id);
    });

    ipcMain.handle("txnmAPI:repositories:grammaticalGenre:readAllByEntry", (event, rawEntry: Entry): GrammaticalGenre[] => {
        const entry: Entry = Entry.Hydrate(rawEntry);
        return GrammaticalGenreRepository.ReadAllByEntry(entry);
    });

    ipcMain.handle("txnmAPI:repositories:grammaticalGenre:readOne", (event, gramGenreId: number) => {
        return GrammaticalGenreRepository.ReadOne(gramGenreId);
    });

    ipcMain.handle("txnmAPI:repositories:grammaticalGenre:create", (event, rawGramGenre: GrammaticalGenre) => {
        const gramGenre: GrammaticalGenre = GrammaticalGenre.Hydrate(rawGramGenre)
        return GrammaticalGenreRepository.Create(gramGenre);
    });

    ipcMain.handle("txnmAPI:repositories:grammaticalGenre:update", (event, rawGramGenre: GrammaticalGenre) => {
        const gramGenre: GrammaticalGenre = GrammaticalGenre.Hydrate(rawGramGenre)
        return GrammaticalGenreRepository.Update(gramGenre);
    });

    ipcMain.handle("txnmAPI:repositories:grammaticalGenre:delete", (event, rawGramGenre: GrammaticalGenre) => {
        const gramGenre: GrammaticalGenre = GrammaticalGenre.Hydrate(rawGramGenre)
        return GrammaticalGenreRepository.Delete(gramGenre);
    });
}