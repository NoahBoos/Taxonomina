import { writable, Writable } from "svelte/store";
import { ErrorDomain, TaxonominaError } from "@/shared/errors/types";

export const definitionFormErrorsStore: Writable<TaxonominaError<ErrorDomain>[]> = writable([]);

export function resetDefinitionFormErrors(): void {
    definitionFormErrorsStore.set([]);
}

export function setDefinitionFormErrors(errors: TaxonominaError<ErrorDomain>[]): void {
    definitionFormErrorsStore.set(errors);
}