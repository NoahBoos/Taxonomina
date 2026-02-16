import { writable, Writable } from "svelte/store";
import { ErrorDomain, TaxonominaError } from "@/shared/errors/types";

export const languageFormErrorsStore: Writable<TaxonominaError<ErrorDomain>[]> = writable([]);

export function resetLanguageFormErrors() {
    languageFormErrorsStore.set([]);
}

export function setLanguageFormErrors(errors: TaxonominaError<ErrorDomain>[]) {
    languageFormErrorsStore.set(errors);
}