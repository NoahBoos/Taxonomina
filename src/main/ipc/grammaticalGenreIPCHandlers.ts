import {ipcMain} from "electron";
import {GrammaticalGenre} from "../database/models/GrammaticalGenre";
import {GrammaticalGenreRepository} from "../database/repositories/GrammaticalGenreRepository";
import {Entry} from "../database/models/Entry";
import {I_Entry} from "../../shared/interfaces/I_Entry";
import {I_GrammaticalGenre} from "../../shared/interfaces/I_GrammaticalGenre";

export function registerGrammaticalGenreIPCHandlers() {
    ipcMain.handle("txnmAPI:repositories:grammaticalGenre:readAll", (_, dictionary_id: number) => {
        return GrammaticalGenreRepository.readAll(dictionary_id);
    });

    ipcMain.handle("txnmAPI:repositories:grammaticalGenre:readAllByEntry", (_, entry_id: number) => {
        return GrammaticalGenreRepository.readAllByEntry(entry_id);
    });

    ipcMain.handle("txnmAPI:repositories:grammaticalGenre:readOne", (_, grammatical_genre_id: number) => {
        return GrammaticalGenreRepository.readOne(grammatical_genre_id);
    });

    ipcMain.handle("txnmAPI:repositories:grammaticalGenre:create", (_, grammatical_genre: I_GrammaticalGenre) => {
        return GrammaticalGenreRepository.create(grammatical_genre);
    });

    ipcMain.handle("txnmAPI:repositories:grammaticalGenre:update", (_, grammatical_genre: I_GrammaticalGenre) => {
        return GrammaticalGenreRepository.update(grammatical_genre);
    });

    ipcMain.handle("txnmAPI:repositories:grammaticalGenre:delete", (_, grammatical_genre_id: number) => {
        return GrammaticalGenreRepository.delete(grammatical_genre_id);
    });
}