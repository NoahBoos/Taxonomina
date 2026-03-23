import { writable, Writable } from "svelte/store";
import { ErrorDomain, TaxonominaError } from "@/shared/errors/types";

export const categoryFormErrorsStore: Writable<TaxonominaError<ErrorDomain>[]> = writable([]);

export function resetCategoryFormErrors(): void {
    categoryFormErrorsStore.set([]);
}

export function setCategoryFormErrors(errors: TaxonominaError<ErrorDomain>[]): void {
    categoryFormErrorsStore.set(errors);
}