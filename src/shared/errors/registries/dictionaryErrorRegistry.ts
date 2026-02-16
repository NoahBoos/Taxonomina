import { RegistryManager } from "../RegistryManager";

export const DICTIONARY_ERROR_REGISTRY = RegistryManager.create('dictionary', {
    E0100: { severity: 'error', message: 'Ce dictionnaire doit avoir un nom.' }
});