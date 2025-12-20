import { APP_ERRORS } from "@/const/ErrorTypes.const";
import ResponseHandler from "@/utils/responseHandler";
import HTTP_STATUS from "@/utils/httpStatusCodes";
import { Request, Response, NextFunction } from "express";
import { ZodObject, ZodRawShape } from "zod";

type RequestPart = "body" | "query" | "params"

export const validateRequest = (schema: ZodObject<ZodRawShape> , part : RequestPart = "body") => (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const result = schema.safeParse(req[part]);

  if (!result.success) {
    const formattedErrors = result.error.issues.map((issue) => ({
      field: issue.path.join("."),
      message: issue.message,
    }));

    return ResponseHandler.error(
      res,
      APP_ERRORS.VALIDATION_ERROR,
      HTTP_STATUS.BAD_REQUEST,
      formattedErrors
    );
  }

  req.validated = {
    body : part === 'body' ? result.data : req.validated?.body,
    params : part === 'params' ? result.data : req.validated?.params,
    query : part === 'query' ? result.data : req.validated?.query
  }

  next();
};

interface FileValidationOptions {
  fieldName: string;
  maxSizeMB?: number;
  allowedMimeTypes?: string[];
}

export const validateFile = (options: FileValidationOptions) => (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { fieldName, maxSizeMB = 5, allowedMimeTypes = ["image/"] } = options;

    if (!req.file) {
      return next();
    }

    if (req.file.fieldname !== fieldName) {
      return ResponseHandler.error(
        res,
        `${APP_ERRORS.INVALID_FILE_FIELD} Expected "${fieldName}"`,
        HTTP_STATUS.BAD_REQUEST
      );
    }

    if (!allowedMimeTypes.some(type => req?.file?.mimetype.startsWith(type))) {
      return ResponseHandler.error(res, APP_ERRORS.INVALID_FILE_TYPE, HTTP_STATUS.BAD_REQUEST);
    }

    if (req.file.size > maxSizeMB * 1024 * 1024) {
      return ResponseHandler.error(res, `${APP_ERRORS.LARGE_FILE}, max size is ${maxSizeMB}MB`, HTTP_STATUS.BAD_REQUEST);
    }

    next();
};