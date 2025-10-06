async function ParseHTMLFromString(path: string): Promise<Element | undefined> {
    try {
        const content: string | undefined = await window.txnmAPI.LoadTemplate(path);
        const parser = new DOMParser();
        const html: Document = parser.parseFromString(content!, "text/html");
        return html.body.firstElementChild ?? undefined;
    } catch (error) {
        console.error("An error happened trying to parse HTML from the provided template. \n", error);
        return undefined;
    }
}

async function Renderer() {
    console.log("[Renderer] - Renderer() called.");
    const leftLeaf: HTMLElement = document.getElementById("left-leaf")!;
    const rightLeaf: HTMLElement = document.getElementById("right-leaf")!;

    const dictionaryCreationForm: Element | undefined = await ParseHTMLFromString("forms/dictionary");
    leftLeaf.appendChild(dictionaryCreationForm!);

    const button = dictionaryCreationForm!.querySelector<HTMLButtonElement>("#submit");
    button?.addEventListener("click", async (event: Event) => {
        event.preventDefault();
        console.log("[Renderer] - Button clicked!");
        let dictionaryToCreate: { name: string; description: string } = {
            name: "My cool dictionary",
            description: "The description of my cool dictionary.",
        };
        if (dictionaryCreationForm!.querySelector<HTMLInputElement>("#name")!.value != "") {
            dictionaryToCreate.name = dictionaryCreationForm!.querySelector<HTMLInputElement>("#name")!.value;
        }
        if (dictionaryCreationForm!.querySelector<HTMLInputElement>("#description")!.value != "") {
            dictionaryToCreate.description = dictionaryCreationForm!.querySelector<HTMLInputElement>("#description")!.value;
        }
        const success: boolean = await window.txnmAPI.repositories.dictionary.Create(dictionaryToCreate);
        if (success) console.log("[Renderer] - The dictionary has been successfully created.")
        else console.log("[Renderer] - The dictionary creation has been aborted.");
    });
}

console.log("[Renderer] - Loaded");
Renderer();