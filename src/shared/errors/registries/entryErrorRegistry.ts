import { RegistryManager } from "../RegistryManager";

export const ENTRY_ERROR_REGISTRY = RegistryManager.create('entry', {
    E0300: { severity: 'error', message: 'Une entrée avec cette identifiant existe déjà.' },
    E0301: { severity: 'error', message: 'Une entrée ne peut pas être créée sans un dictionnaire actif. Veuillez définir un dictionnaire actif.' },
    E0302: { severity: 'error', message: 'Une entrée ne peut pas être créée sans être liée à une langue. Veuillez en sélectionner une.' },
    E0303: { severity: 'error', message: 'Le lemme ne peut pas être vide. Veuillez en saisir un.' }
});