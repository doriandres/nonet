# NoNET 
ASP .NET like library for Node.js with batteries included built on top of TypeScript, Express, Pino and Axios.

## Installation
NoNet is available as an [npm package](https://www.npmjs.com/package/nonet).

```console
$ npm i -s nonet
```

## Usage Example

### App Startup
```ts
/* 
 * file: /src/index.ts 
 */
import { addController, addWebEssentials, createLogger, createServer, HttpClientFactory, register } from "nonet";
import { HomeController } from "./controllers/HomeController";

const server = createServer();
addWebEssentials(server);

// Register controllers
addController(server, HomeController);

const logger = createLogger();
// Register services to inject
register("logger", createLogger);
register("http.client.factory", HttpClientFactory);

server.listen(8080, () => logger.info("Server ready at http://localhost:8080"));
```

### Defining a Controller
```ts
/* 
 * file: /src/controllers/HomeController.ts 
 */
import { controller, inject, route, HttpMethod } from "nonet";
import { Request, Response } from "express";
import { Logger } from "pino";

@controller()
export class HomeController {
  @inject("logger") // Injects the logger service
  logger: Logger;

  @route("/", HttpMethod.GET)
  async index(req: Request, res: Response) {
    this.logger.info("Request received!");
    res.send("Hello World!");
  }
}
```