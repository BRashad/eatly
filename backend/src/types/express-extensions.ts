import type { Request } from "express";
import type { BarcodeParam, BulkImportRequest } from "@validators/product-validator";

// Extend Express Request type to include validated data
declare global {
  namespace Express {
    interface Request {
      validatedParams?: BarcodeParam;
      validatedBody?: BulkImportRequest;
    }
  }
}

export {};
