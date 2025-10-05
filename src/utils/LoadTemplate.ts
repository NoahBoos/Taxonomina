export async function LoadTemplate(path: string): Promise<Element | undefined> {
    try {
        const response = await fetch(`/src/views/components/${path}.html`);
        if(!response.ok) {
            throw new Error(response.statusText);
        }
        const parser: DOMParser = new DOMParser();
        const html: string = await response.text();
        const parsedDocument: Document = parser.parseFromString(html, "text/html");
        const template: Element = parsedDocument.body.firstElementChild!;
        return template;
    } catch (error) {
        console.error(`Impossible to load the requested template. \n${error}`);
        return undefined;
    }
}