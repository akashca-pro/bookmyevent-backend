import HTTP_STATUS from "@/utils/httpStatusCodes";
import { NextFunction, Request, Response } from "express";
import logger from "@/utils/pinoLogger";
import ResponseHandler from "@/utils/responseHandler";
import PrettyError from "pretty-error";

export const notFound = (req: Request, res: Response) => {
  logger.error(`Resource not found: ${req.method} ${req.url}`);
  return ResponseHandler.error(res, "Resource not found", HTTP_STATUS.NOT_FOUND);
};

export const globalErrorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  const time = new Date().toISOString();
  const { method, originalUrl, ip } = req;

  const pe = new PrettyError();
  pe.skipNodeFiles();
  pe.skipPackage("express");

  const message = err instanceof Error ? err.message : String(err);

  const stack =
    err instanceof Error
      ? pe.render(err)
      : undefined;

  logger.error("Unhandled exception", {
    time,
    method,
    url: originalUrl,
    ip,
    message,
    stack
  });

  return ResponseHandler.error(
    res,
    "Internal Server Error",
    HTTP_STATUS.INTERNAL_SERVER_ERROR
  );
};
