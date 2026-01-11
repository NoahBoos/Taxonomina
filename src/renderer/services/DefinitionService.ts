import {I_Definition} from "@/shared/interfaces/I_Definition";
import {I_Entry} from "@/shared/interfaces/I_Entry";

export class DefinitionService {
    public static async ReadAll(): Promise<I_Definition[]> {
        return await window.txnmAPI.repositories.definition.ReadAll();
    }

    public static async ReadAllByEntry(entry: I_Entry): Promise<I_Definition[]> {
        return await window.txnmAPI.repositories.definition.ReadAllByEntry(entry);
    }

    public static async ReadOne(definitionId: number): Promise<I_Definition> {
        return await window.txnmAPI.repositories.definition.ReadOne(definitionId);
    }

    public static async BindToTranslation(definition: I_Definition, translation: I_Entry) {
        return await window.txnmAPI.repositories.definition.BindToTranslation(definition, translation);
    }

    public static async UnbindFromTranslation(definition: I_Definition, translation: I_Entry) {
        return await window.txnmAPI.repositories.definition.UnbindFromTranslation(definition, translation);
    }

    public static async Save(definition: I_Definition): Promise<[boolean, I_Definition | undefined]> {
        let [success, savedDefinition] = definition.id == 0
            ? await window.txnmAPI.repositories.definition.Create(definition)
            : await window.txnmAPI.repositories.definition.Update(definition);
        return [success, savedDefinition];
    }

    public static async Delete(definition: I_Definition): Promise<boolean> {
        return await window.txnmAPI.repositories.definition.Delete(definition);
    }
}