import {readFile} from "node:fs/promises";
import path from "node:path";

export async function LoadTemplate(templatePath: string): Promise<string | undefined> {
    try {
        const absolutePath = path.resolve(__dirname, `../views/components/${templatePath}.html`);
        const content: string = await readFile(absolutePath, "utf8");
        return content;
    } catch (error) {
        console.error(`Impossible to load the requested template. \n`, error);
        return undefined;
    }
}