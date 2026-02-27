import { writable, Writable } from "svelte/store";

export const lockedFieldValuesStore: Writable<{ [key: string]: any }> = writable({});