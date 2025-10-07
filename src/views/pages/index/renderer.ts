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

    const languageDrawerButton: HTMLElement = document.getElementById("language-drawer-button")!;
    languageDrawerButton.addEventListener("click", (event: Event) => {
        CreateAndHandleLanguageDrawer(leftLeaf, rightLeaf);
    })
}

console.log("[Renderer] - Loaded");
Renderer();

async function CreateAndHandleDictionaryForm(parent: HTMLElement) {
    const dictionaryCreationForm: Element | undefined = await ParseHTMLFromString("forms/dictionary");
    parent.appendChild(dictionaryCreationForm!);

    const button: HTMLButtonElement = dictionaryCreationForm!.querySelector<HTMLButtonElement>("#submit")!;
    button?.addEventListener("click", async (event: Event) => {
        event.preventDefault();
        let dictionaryToCreate: { name: string; description: string } = {name: "", description: ""};
        const inputNameValue: string = dictionaryCreationForm!.querySelector<HTMLInputElement>("#name")!.value ?? "";
        const inputDescriptionValue: string = dictionaryCreationForm!.querySelector<HTMLInputElement>("#description")!.value ?? "";
        if (inputNameValue == "") return;
        dictionaryToCreate.name = inputNameValue;
        dictionaryToCreate.description = inputDescriptionValue;
        await window.txnmAPI.repositories.dictionary.Create(dictionaryToCreate);
    });
}

async function CreateAndHandleLanguageDrawer(leftLeaf: HTMLElement, rightLeaf: HTMLElement) {
    const languageDrawer: Element | undefined = await ParseHTMLFromString("drawers/language");
    if (languageDrawer) {
        leftLeaf.replaceChildren(languageDrawer);

        const languageFormButton: HTMLButtonElement = languageDrawer!.querySelector<HTMLButtonElement>("#language-form-button")!;
        languageFormButton?.addEventListener("click", async (event: Event) => {
            event.preventDefault();
        })
    }
}