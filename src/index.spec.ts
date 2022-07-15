import { Configuration, SpaceApi, apiVersion } from "./generated";

describe("SpaceApi", () => {
    it("client should be defined", function () {
        expect(SpaceApi).toBeDefined();
    });

    it("version should be defined", () => {
        expect(apiVersion).toBeDefined();
    });

    it("should get all projects from api", async function () {
        expect(process.env.SPACE_API_URL).toBeDefined();
        expect(process.env.SPACE_API_TOKEN).toBeDefined();
        const client = new SpaceApi(
            new Configuration({
                basePath: process.env.SPACE_API_URL,
                accessToken: process.env.SPACE_API_TOKEN
            })
        );
        expect(client).toBeDefined();
        expect(client.projectsGet).toBeDefined();
        await expect(client.projectsGet().then((result) => result.data.data)).resolves.toBeDefined();
    });
});
