import { ErrorDomain, ErrorSeverity, TaxonominaError } from "./types";

export class RegistryManager {
    public static create<D extends ErrorDomain, T extends Record<string, { severity: ErrorSeverity, message: string }>>(domain: D, definitions: T) {
        const result = {} as {
            [K in keyof T]: TaxonominaError<ErrorDomain>
        };

        for (const code in definitions) {
            result[code] = {
                code: code as any,
                domain: domain,
                severity: definitions[code].severity,
                message: definitions[code].message
            }
        }

        return result as { [K in keyof T]: TaxonominaError<ErrorDomain> };
    }
}