export class TemplateManager {
    public static async LoadTemplateAsString(templatePath: string): Promise<string | undefined> {
        return await window.txnmAPI.LoadTemplateAsString(templatePath);
    }

    public static async ParseHTMLFromString(stringToParse: string): Promise<Element | undefined> {
        try {
            const parser = new DOMParser();
            const html: Document = parser.parseFromString(stringToParse, "text/html");
            return html.body.firstElementChild ?? undefined;
        } catch (error) {
            console.error("An error happened trying to parse HTML from the provided string. \n", error);
            return undefined;
        }
    }

    public static async LoadTemplateAsHTML(templatePath: string) {
        try {
            const stringToParse: string | undefined = await this.LoadTemplateAsString(templatePath);
            if (!stringToParse) throw new Error("Impossible to load the request template.");
            const html: Element | undefined = await this.ParseHTMLFromString(stringToParse);
            if (!html) throw new Error("An error happened trying to parse HTML from the provided string.");
            return html;
        } catch (error) {
            console.error("An error happened trying to parse HTML from the provided template. \n", error);
        }
    }
}

