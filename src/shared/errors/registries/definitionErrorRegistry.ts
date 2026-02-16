import { RegistryManager } from "../RegistryManager";

export const DEFINITION_ERROR_REGISTRY = RegistryManager.create('definition', {
    E0400: { severity: 'error', message: 'Une définition avec cette identifiant existe déjà.' },
    E0401: { severity: 'error', message: 'Une définition ne peut pas être créée sans être liée à une entrée. Veuillez en sélectionner une.' },
    E0402: { severity: 'error', message: 'Le contenu d\'une définition ne peut pas être vide. Veuillez en saisir un.' }
});