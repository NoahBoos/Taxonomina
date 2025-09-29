export class Dictionary {
    private readonly id: number;
    private name: string;
    private description: string;

    constructor(id: number, name: string, description: string) {
        this.id = id;
        this.name = name;
        this.description = description;
    }

    public GetId() {
        return this.id;
    }

    public GetName() {
        return this.name;
    }
    public SetName(name: string) {
        this.name = name;
    }

    public GetDescription() {
        return this.description;
    }
    public SetDescription(description: string) {
        this.description = description;
    }
}