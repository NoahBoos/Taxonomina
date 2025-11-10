import {Definition} from "../database/models/Definition";
import {Entry} from "../database/models/Entry";

export class DefinitionService {
    public static async ReadAll(): Promise<Definition[]> {
        const rawDefinitions: Definition[] = await window.txnmAPI.repositories.definition.ReadAll();
        return rawDefinitions.map((rawDefinition: Definition): Definition => Definition.Hydrate(rawDefinition));
    }

    public static async ReadAllByEntry(entry: Entry): Promise<Definition[]> {
        const rawDefinitions: Definition[] = await window.txnmAPI.repositories.definition.ReadAllByEntry(entry);
        return rawDefinitions.map((rawDefinition: Definition): Definition => Definition.Hydrate(rawDefinition));
    }

    public static async ReadOne(definitionId: number): Promise<Definition> {
        const rawDefinition: Definition = await window.txnmAPI.repositories.definition.ReadOne(definitionId);
        return Definition.Hydrate(rawDefinition);
    }

    public static async BindToTranslation(definition: Definition, translation: Entry) {
        return await window.txnmAPI.repositories.definition.BindToTranslation(definition, translation);
    }

    public static async UnbindFromTranslation(definition: Definition, translation: Entry) {
        return await window.txnmAPI.repositories.definition.UnbindFromTranslation(definition, translation);
    }

    public static async Save(definition: Definition): Promise<[boolean, Definition | undefined]> {
        let [success, savedDefinition] = definition.GetId() == 0
            ? await window.txnmAPI.repositories.definition.Create(definition)
            : await window.txnmAPI.repositories.definition.Update(definition);
        return [success, Definition.Hydrate(savedDefinition)];
    }

    public static async Delete(definition: Definition): Promise<boolean> {
        return await window.txnmAPI.repositories.definition.Delete(definition);
    }
}