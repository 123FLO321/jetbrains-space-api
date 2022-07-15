// Dummy file for initial release

export class Configuration {
    public constructor(private readonly configuration: unknown) {}
}

export class SpaceApi {
    public constructor(private readonly configuration: Configuration) {}

    public projectsGet(): Promise<{ data: { data: unknown[] } }> {
        return Promise.resolve({ data: { data: [] } });
    }
}

export const apiVersion = "0.0.0";
