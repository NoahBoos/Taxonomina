import { writable, Writable } from "svelte/store";

type ListState = { state: "list" };
type SaveState = { state: "save"; id: number };
type DeleteState = { state: "delete"; id: number };
type ModalState = ListState | SaveState | DeleteState;

export const dictionaryModalStateStore: Writable<ModalState> = writable({ state: "list" });

export function setToList(): void {
    dictionaryModalStateStore.set({ state: "list" });
}

export function setToSave(id: number = 0): void {
    dictionaryModalStateStore.set({ state: "save", id: id });
}

export function setToDelete(id: number): void {
    dictionaryModalStateStore.set({ state: "delete", id: id });
}