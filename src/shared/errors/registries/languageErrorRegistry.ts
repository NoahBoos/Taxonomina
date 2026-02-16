import { RegistryManager } from "../RegistryManager";

export const LANGUAGE_ERROR_REGISTRY = RegistryManager.create('language', {
    E0200: { severity: 'error', message: 'Une langue avec cette identifiant existe déjà.' },
    E0201: { severity: 'error', message: 'Une langue ne peut pas être créée sans un dictionnaire actif. Veuillez définir un dictionnaire actif.' },
    E0202: { severity: 'error', message: 'Si vous ajoutez un code ISO 639-1, il doit faire deux caractères. Veuillez adapter le code en conséquence.' },
    E0203: { severity: 'error', message: 'Si vous ajoutez un code ISO 639-3, il doit faire trois caractères. Veuillez adapter le code en conséquence.' },
    E0204: { severity: 'error', message: 'Le nom natif d\'une langue ne peut pas être vide. Veuillez en saisir un.' },
    E0205: { severity: 'error', message: 'Le nom local d\'une langue ne peut pas être vide. Veuillez en saisir un.' }
});