import { ErrorDomain, TaxonominaError } from "../errors/types";

export class FormValidationError extends Error {
    public errors: TaxonominaError<ErrorDomain>[];

    constructor(message: string, cause: string, errors: TaxonominaError<ErrorDomain>[]) {
        super(message);
        this.cause = cause;
        this.errors = errors;
    }
}