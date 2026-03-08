import {ipcMain} from "electron";
import {CategoryRepository} from "../database/repositories/CategoryRepository";
import {I_Category} from "../../shared/interfaces/I_Category";

export function registerCategoryIPCHandlers() {
    ipcMain.handle("txnmAPI:repositories:category:readAll", (_, dictionary_id: number) => {
        return CategoryRepository.readAll(dictionary_id);
    });

    ipcMain.handle("txnmAPI:repositories:category:readAllByDefinition", (_, definition_id: number) => {
        return CategoryRepository.readAllByDefinition(definition_id);
    });

    ipcMain.handle("txnmAPI:repositories:category:readOne", (_, category_id: number) => {
        return CategoryRepository.readOne(category_id);
    });

    ipcMain.handle("txnmAPI:repositories:category:create", (_, category: I_Category) => {
        return CategoryRepository.create(category);
    });

    ipcMain.handle("txnmAPI:repositories:category:update", (_, category: I_Category) => {
        return CategoryRepository.update(category);
    });

    ipcMain.handle("txnmAPI:repositories:category:delete", (_, category_id: number) => {
        return CategoryRepository.delete(category_id);
    });
}