async function ParseHTMLFromString(path: string): Promise<Element | undefined> {
    try {
        const content: string | undefined = await window.txnmTemplates.LoadTemplate(path);
        const parser = new DOMParser();
        const html: Document = parser.parseFromString(content!, "text/html");
        return html.body.firstElementChild ?? undefined;
    } catch (error) {
        console.error("An error happened trying to parse HTML from the provided template. \n", error);
        return undefined;
    }
}

async function Renderer() {
    const leftLeaf: HTMLElement = document.getElementById("left-leaf")!;
    const rightLeaf: HTMLElement = document.getElementById("right-leaf")!;

    const dictionaryCreationForm: Element | undefined = await ParseHTMLFromString("forms/dictionary");
    leftLeaf.appendChild(dictionaryCreationForm!);
}

Renderer();