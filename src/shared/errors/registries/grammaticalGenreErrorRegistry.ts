import { RegistryManager } from "../RegistryManager";

export const GRAMMATICAL_GENRE_ERROR_REGISTRY = RegistryManager.create('grammatical_genre', {
    E0600: { severity: 'error', message: 'Un genre grammatical avec cette identifiant existe déjà.' },
    E0601: { severity: 'error', message: 'Un genre grammatical ne peut pas être créé sans un dictionnaire actif. Veuillez définir un dictionnaire actif.' },
    E0602: { severity: 'error', message: 'Le nom d\'un genre grammatical ne peut pas être vide. Veuillez en saisir un.' }
});