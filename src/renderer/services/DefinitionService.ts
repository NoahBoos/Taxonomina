import {I_Definition} from "@/shared/interfaces/I_Definition";

export class DefinitionService {
    public static async readAll(): Promise<I_Definition[]> {
        return await window.txnmAPI.repositories.definition.readAll();
    }

    public static async readAllByEntry(entry_id: number): Promise<I_Definition[]> {
        return await window.txnmAPI.repositories.definition.readAllByEntry(entry_id);
    }

    public static async readOne(definition_id: number): Promise<I_Definition> {
        return await window.txnmAPI.repositories.definition.readOne(definition_id);
    }

    public static async save(definition: I_Definition): Promise<[boolean, I_Definition | undefined]> {
        let [success, savedDefinition] = definition.id == 0
            ? await window.txnmAPI.repositories.definition.create(definition)
            : await window.txnmAPI.repositories.definition.update(definition);
        return [success, savedDefinition];
    }

    public static async delete(definition_id: number): Promise<boolean> {
        return await window.txnmAPI.repositories.definition.delete(definition_id);
    }

    public static async bindToTranslation(definition_id: number, translation_id: number) {
        return await window.txnmAPI.repositories.definition.bindToTranslation(definition_id, translation_id);
    }

    public static async unbindFromTranslation(definition_id: number, translation_id: number) {
        return await window.txnmAPI.repositories.definition.unbindFromTranslation(definition_id, translation_id);
    }
}