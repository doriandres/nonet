import crypto from "crypto";
import { Express } from "express";
import httpLogger from "pino-http";
import pino from "pino";

export function createLogger() {
  return pino({
    transport: {
      target: "pino-pretty",
    },
  });
}

export function addCorrelationId(
  app: Express,
  headerName = "x-correlation-id"
) {
  app.use((req, res, next) => {
    let correlationId = req.headers[headerName] as string;
    if (!correlationId) {
      correlationId = crypto.randomUUID();
      req.headers[headerName] = correlationId;
    }
    if (correlationId) {
      res.set(headerName, correlationId);
    }
    next();
  });
}

export function addHttpLogger(app: Express) {
  app.use(httpLogger());
}
