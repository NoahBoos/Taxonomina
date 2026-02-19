import { writable, Writable } from "svelte/store";
import { ErrorDomain, TaxonominaError } from "@/shared/errors/types";

export const grammaticalGenreFormErrorsStore: Writable<TaxonominaError<ErrorDomain>[]> = writable([]);

export function resetGrammaticalGenreFormErrors(): void {
    grammaticalGenreFormErrorsStore.set([]);
}

export function setGrammaticalGenreFormErrors(errors: TaxonominaError<ErrorDomain>[]): void {
    grammaticalGenreFormErrorsStore.set(errors);
}