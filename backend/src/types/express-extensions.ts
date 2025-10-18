import type { Request } from "express";
import type { BarcodeParam, BulkImportRequest } from "@validators/product-validator";

// Extend Express Request type to include validated data
declare global {
  namespace Express {
    interface Request {
      validatedParams?: BarcodeParam | BulkImportRequest | unknown;
      validatedBody?: BulkImportRequest | unknown;
    }
  }
}

// Type guards for better type safety
export function hasBarcodeParams(req: Request): req is Request & { validatedParams: BarcodeParam } {
  return !!(req.validatedParams && typeof req.validatedParams === 'object' && 'barcode' in req.validatedParams);
}

export function hasBulkImportBody(req: Request): req is Request & { validatedBody: BulkImportRequest } {
  return !!(req.validatedBody && typeof req.validatedBody === 'object' && 'searchTerms' in req.validatedBody);
}

export {};
