import { ErrorDomain, TaxonominaError } from "@/shared/errors/types";
import { Writable, writable } from "svelte/store";

export const dictionaryFormErrorsStore: Writable<TaxonominaError<ErrorDomain>[]> = writable([]);

export function resetDictionaryFormErrors(): void {
    dictionaryFormErrorsStore.set([]);
}

export function setDictionaryFormErrors(errors: TaxonominaError<ErrorDomain>[]): void {
    dictionaryFormErrorsStore.set(errors);
}