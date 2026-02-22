import { Writable, writable } from "svelte/store";
import { ErrorDomain, TaxonominaError } from "@/shared/errors/types";

export const entryFormErrorsStore: Writable<TaxonominaError<ErrorDomain>[]> = writable([]);

export function resetEntryFormErrors(): void {
    entryFormErrorsStore.set([]);
}

export function setEntryFormErrors(errors: TaxonominaError<ErrorDomain>[]): void {
    entryFormErrorsStore.set(errors);
}