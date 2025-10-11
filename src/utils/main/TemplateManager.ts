import path from "node:path";
import {readFile} from "node:fs/promises";

export async function LoadTemplateAsString(templatePath: string): Promise<string | undefined> {
    console.log(`Given path : ${templatePath}`);
    try {
        const absolutePath = path.resolve(__dirname, `../../views/components/${templatePath}.html`);
        console.log(`Absolute path : ${absolutePath}`);
        const content: string = await readFile(absolutePath, "utf8");
        console.log(content);
        return content;
    } catch (error) {
        console.error(`Impossible to load the requested template. \n`, error);
        return undefined;
    }
}