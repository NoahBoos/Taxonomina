import { RegistryManager } from "../RegistryManager";

export const COMMON_ERROR_REGISTRY = RegistryManager.create('common', {
    E0000: { target: { type: 'system' }, severity: 'error', message: 'La connexion à la base de données à échouée.'}
});