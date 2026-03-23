import { RegistryManager } from "../RegistryManager";

export const CATEGORY_ERROR_REGISTRY = RegistryManager.create('category', {
   E0700: { target: { type: 'system' }, severity: 'error', message: 'Une catégorie avec cette identifiant existe déjà.' },
   E0701: { target: { type: 'system' }, severity: 'error', message: 'Une catégorie ne peut pas être créée sans un dictionnaire actif. Veuillez définir un dictionnaire actif.' },
   E0702: { target: { type: 'form_field', field_name: 'name' }, severity: 'error', message: 'Le nom d\'une catégorie ne peut pas être vide. Veuillez en saisir un.' }
});