import { RegistryManager } from "../RegistryManager";

export const GRAMMATICAL_CLASS_ERROR_REGISTRY = RegistryManager.create('grammatical_class', {
    E0500: { target: { type: 'system' }, severity: 'error', message: 'Une classe grammaticale avec cette identifiant existe déjà.' },
    E0501: { target: { type: 'system' }, severity: 'error', message: 'Une classe grammaticale ne peut pas être créée sans un dictionnaire actif. Veuillez définir un dictionnaire actif.' },
    E0502: { target: { type: 'form_field', field_name: 'name' }, severity: 'error', message: 'Le nom d\'une classe grammaticale ne peut pas être vide. Veuillez en saisir un.' },
});