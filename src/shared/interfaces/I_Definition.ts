import { I_Category } from "./I_Category";

export interface I_Definition {
    id: number;
    definition: string;
    categories: I_Category[] | undefined;
    clientKey: `definition:${string}`;
}