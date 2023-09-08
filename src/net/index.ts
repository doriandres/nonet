import dotenv from "dotenv";
try {
  dotenv.config();
} catch {
  /* .env not found */
}
import express, { Express } from "express";
import { engine } from "express-handlebars";

export enum HttpMethod {
  GET = "get",
  POST = "post",
  PUT = "put",
  DELETE = "delete",
  PATCH = "patch",
  OPTIONS = "options",
  HEAD = "head",
  ALL = "all",
}

export function createServer() {
  return express();
}

export function controller(basePath: string = "") {
  return function decorator<TController extends { new (...args: any[]): any }>(
    Controller: TController
  ) {
    (Controller as any).__basePath = basePath;
    return Controller;
  };
}

export function route(path: string, method: HttpMethod = HttpMethod.ALL) {
  return function decorator(
    target: any,
    key: string,
    descriptor: PropertyDescriptor
  ) {
    const Controller = target.constructor;
    if (!Controller.__routes) Controller.__routes = [];
    Controller.__routes.push({ path, verb: method, method: key });
  };
}

export function addHandlerbars(app: Express) {
  app.engine("handlebars", engine());
  app.set("view engine", "handlebars");
  app.set("views", "./views");
}

export function addPublicDir(app: Express, path: string) {
  app.use(express.static(path));
}

export function addWebEssentials(app: Express) {
  app.use(express.json());
  app.use(express.text());
  app.use(express.urlencoded({ extended: false }));
}

export function addController<
  TController extends { new (...args: any[]): any }
>(app: Express, Controller: TController) {
  const routes = (Controller as any)?.__routes || [];
  const basePath = (Controller as any)?.__basePath || "";
  for (const route of routes as {
    path: string;
    verb: HttpMethod;
    method: string;
  }[]) {
    app[route.verb](`${basePath}${route.path}`, (...args) => {
      const controller = new Controller();
      return controller[route.method](...args);
    });
  }
}
