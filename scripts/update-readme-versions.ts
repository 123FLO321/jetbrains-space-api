import {readFile, writeFile} from "fs/promises";

const readmeFile = "README.md";
const packageFile = "package.json";
const generatedIndexFile = "src/generated/index.ts";
const headerLengthPackageVersion = 17;
const headerLengthApiVersion = 21;

async function updateReadmeVersions(): Promise<void> {
    console.log("reading files")
    const readmeContents = await readFile(readmeFile, "utf8");
    const packageContents = JSON.parse(await readFile(packageFile, "utf8")) as { version: string };
    const generatedIndexContents = await readFile(generatedIndexFile, "utf8");

    console.log("parsing versions")
    const packageVersion = packageContents.version;
    const apiVersion = generatedIndexContents.match(/export const apiVersion = "(?<version>.*)"/)?.groups?.version;
    if (!packageVersion) {
        throw new Error("Failed to read package version");
    }
    if (!apiVersion) {
        throw new Error("Failed to read api version");
    }

    console.log("parsing readme")
    const readmeLines = readmeContents.split("\n");
    const tableStartIndex = readmeLines.indexOf("## Versions")
    if (tableStartIndex < 0) {
        throw new Error("Failed to find versions table");
    }
    let packageVersionPart = ` ${packageVersion} `;
    let apiVersionPart = ` ${apiVersion} `;
    if (packageVersionPart.length < headerLengthPackageVersion) {
        packageVersionPart = packageVersionPart + " ".repeat(headerLengthPackageVersion - packageVersionPart.length);
    }
    if (apiVersionPart.length < headerLengthApiVersion) {
        apiVersionPart = apiVersionPart + " ".repeat(headerLengthApiVersion - apiVersionPart.length);
    }
    const newLine = `|${packageVersionPart}|${apiVersionPart}|`;
    readmeLines.splice(tableStartIndex + 3, 0, newLine);

    console.log("writing readme")
    await writeFile(readmeFile, readmeLines.join("\n"));
}

updateReadmeVersions().then(() => {
    console.log("done")
}).catch(error => {
    console.error("failed", error)
});
