import { ErrorDomain, ErrorSeverity, TaxonominaError } from "./types";

export class RegistryManager {
    public static DOMAIN_MAP: Record<string, ErrorDomain> = {
        E00: 'common',
        E01: 'dictionary',
        E02: 'language',
        E03: 'entry',
        E04: 'definition',
        E05: 'grammatical_class',
        E06: 'grammatical_genre',
    }

    public static create<T extends Record<string, { severity: ErrorSeverity, message: string }>>(definitions: T) {
        const result = {} as {
            [K in keyof T]: TaxonominaError<ErrorDomain>
        };

        for (const code in definitions) {
            const domain: ErrorDomain = this.DOMAIN_MAP[code.slice(0, 3)];

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