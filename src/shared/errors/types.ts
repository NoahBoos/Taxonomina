export type ErrorDomain =
    | 'common'
    | 'dictionary'
    | 'language'
    | 'entry'
    | 'definition'
    | 'grammatical_class'
    | 'grammatical_genre';

export type ErrorSeverity = 'error' | 'warning';

export type ErrorCode<D extends ErrorDomain> =
    D extends 'common' ? `E00${string}` :
    D extends 'dictionary' ? `E01${string}` :
    D extends 'language' ? `E02${string}` :
    D extends 'entry' ? `E03${string}` :
    D extends 'definition' ? `E04${string}` :
    D extends 'grammatical_class' ? `E05${string}` :
    D extends 'grammatical_genre' ? `E06${string}` :
    never;

export type TaxonominaError<D extends ErrorDomain> = {
    code: ErrorCode<D>;
    domain: D;
    severity: ErrorSeverity;
    message: string;
}