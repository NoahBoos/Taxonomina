import { writable, Writable } from "svelte/store";
import { ErrorDomain, TaxonominaError } from "@/shared/errors/types";

export const grammaticalClassFormErrorsStore: Writable<TaxonominaError<ErrorDomain>[]> = writable([]);

export function resetGrammaticalClassFormErrors(): void {
    grammaticalClassFormErrorsStore.set([]);
}

export function setGrammaticalClassFormErrors(errors: TaxonominaError<ErrorDomain>[]): void {
    grammaticalClassFormErrorsStore.set(errors);
}