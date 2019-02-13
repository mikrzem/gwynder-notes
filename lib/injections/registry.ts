export abstract class Registry<Registered> {

    protected readonly all: Registered[] = [];

    public async initialize() { }

    protected add<T extends Registered>(registered: T): T {
        this.all.push(registered);
        return registered;
    }

}