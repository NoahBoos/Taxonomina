import { RegistryManager } from "../RegistryManager";

export const DICTIONARY_ERROR_REGISTRY = RegistryManager.create('dictionary', {
    E0100: { target: { type: 'form_field', field_name: 'name' }, severity: 'error', message: 'Ce dictionnaire doit avoir un nom.' }
});