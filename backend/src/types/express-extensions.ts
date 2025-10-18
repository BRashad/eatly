import type { Request } from "express";
import type {
  BarcodeParam,
  BulkImportRequest as BulkImportRequestBody,
} from "@validators/product-validator";

// Extend Express Request type to include validated data without unknown
declare global {
  namespace Express {
    interface Request {
      validatedParams?: BarcodeParam;
      validatedBody?: BulkImportRequestBody;
    }
  }
}

// Separate request interfaces for type-safe validation
export interface BarcodeRequest extends Request {
  validatedParams: BarcodeParam;
}

export interface BulkImportRequest extends Request {
  validatedBody: BulkImportRequestBody;
}

// Type guards for runtime type checking
export function hasBarcodeParams(req: Request): req is BarcodeRequest {
  return !!(
    req.validatedParams &&
    typeof req.validatedParams === "object" &&
    "barcode" in req.validatedParams
  );
}

export function hasBulkImportBody(req: Request): req is BulkImportRequest {
  return !!(
    req.validatedBody &&
    typeof req.validatedBody === "object" &&
    "searchTerms" in req.validatedBody
  );
}

export {};
