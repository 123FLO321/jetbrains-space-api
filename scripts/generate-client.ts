import {copyFile, mkdir, readdir, readFile, rm, stat, writeFile} from "fs/promises";
import {exec} from "child_process"
import {promisify} from "util";

const inputDefinitionFile = "res/space-open-api.json";
const tempDefinitionFile = "temp/space-open-api-fixed.json";
const tempGeneratedPath = "temp/generated";
const generatedIndexFile = `${tempGeneratedPath}/index.ts`
const outputGeneratedPath = "src/generated";

async function generateClient(): Promise<void> {
    console.log("preparing directories")
    await stat(tempGeneratedPath).then(() => rm(tempGeneratedPath, {recursive: true})).catch(() => /* ignore */ undefined);
    await stat(outputGeneratedPath).then(() => rm(outputGeneratedPath, {recursive: true})).catch(() => /* ignore */ undefined);
    await mkdir(tempGeneratedPath, {recursive: true});
    await mkdir(outputGeneratedPath, {recursive: true});

    console.log("reading open api definition")
    const definition = JSON.parse(await readFile(inputDefinitionFile, "utf8")) as { info: { version: string }, tags: { name: string }[], paths: { [key: string]: { [key: string]: { tags: string[], description: string | { text: string } } } } };

    console.log("fixing open api definition format")
    definition.tags = [{name: "space"}];
    for (const path of Object.values(definition.paths)) {
        for (const method of Object.values(path)) {
            method.tags = ["space"];
            if (typeof method.description !== "string" && method.description) {
                method.description = method.description.text;
            }
        }
    }

    console.log("writing fixed open api definition")
    await writeFile(tempDefinitionFile, JSON.stringify(definition));

    console.log("generating client files")
    await promisify(exec)([
        "npx",
        "openapi-generator-cli",
        "generate",
        `-i ${tempDefinitionFile}`,
        "-g typescript-axios",
        `-o ${tempGeneratedPath}`,
        `--additional-properties=${[
            "withInterfaces=true",
            "nullSafeAdditionalProps=true"
        ].join(",")}`
    ].join(" "));

    console.log("updating generated index file")
    let indexContents = await readFile(generatedIndexFile, {encoding: "utf8"});
    indexContents += `export const apiVersion = "${definition.info.version}"\n`
    await writeFile(generatedIndexFile, indexContents)

    console.log("moving client files")
    for (const file of await readdir(tempGeneratedPath)) {
        if (file.endsWith(".ts")) {
            await copyFile(`${tempGeneratedPath}/${file}`, `${outputGeneratedPath}/${file}`);
        }
    }
}

generateClient().then(() => {
    console.log("done")
}).catch(error => {
    console.error("failed", error)
});
