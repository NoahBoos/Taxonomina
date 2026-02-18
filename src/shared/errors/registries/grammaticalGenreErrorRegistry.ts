import { RegistryManager } from "../RegistryManager";

export const GRAMMATICAL_GENRE_ERROR_REGISTRY = RegistryManager.create('grammatical_genre', {
    E0600: { target: { type: 'system' }, severity: 'error', message: 'Un genre grammatical avec cette identifiant existe déjà.' },
    E0601: { target: { type: 'system' }, severity: 'error', message: 'Un genre grammatical ne peut pas être créé sans un dictionnaire actif. Veuillez définir un dictionnaire actif.' },
    E0602: { target: { type: 'form_field', field_name: 'name' }, severity: 'error', message: 'Le nom d\'un genre grammatical ne peut pas être vide. Veuillez en saisir un.' }
});