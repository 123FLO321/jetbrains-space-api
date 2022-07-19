# jetbrains-space-api

Axios client for the [JetBrains Space API](https://www.jetbrains.com/help/space/api.html).

[![npm latest version](https://img.shields.io/npm/v/jetbrains-space-api/latest.svg)](https://www.npmjs.com/package/jetbrains-space-api)
[![npm next version](https://img.shields.io/npm/v/jetbrains-space-api/next.svg)](https://www.npmjs.com/package/jetbrains-space-api)
[![npm beta version](https://img.shields.io/npm/v/jetbrains-space-api/beta.svg)](https://www.npmjs.com/package/jetbrains-space-api)

## Versions
| Package Version | Space Version       |
|-----------------|---------------------|
| 1.1.0           | 2022.2.0-DEV.105866 |
| 1.0.0           | 2022.2.0-DEV.104457 |

## Install

```bash
$ npm install --save-dev jetbrains-space-api
```

## Usage

Basic example for getting all projects.

```typescript
const client = new SpaceApi(
  new Configuration({
    basePath: process.env.SPACE_API_URL,
    accessToken: process.env.SPACE_API_TOKEN
  })
);
const projects = await client.projectsGet();
```
