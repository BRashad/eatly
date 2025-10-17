import { Router } from "express";

import {
  getProductByBarcode,
  fetchProductFromExternal,
  bulkImportProducts,
} from "@controllers/product-controller";
import {
  externalApiRateLimiter,
  bulkImportRateLimiter,
  generalRateLimiter,
} from "@middleware/rate-limiter";
import { validateRequest, validateParams } from "@middleware/validation";
import {
  BarcodeParamSchema,
  BulkImportSchema,
} from "@validators/product-validator";
import { productRepository } from "@repositories/product-repository";

const router = Router();



// Original endpoint - check local database only
router.get(
  "/barcode/:barcode",
  validateParams(BarcodeParamSchema),
  generalRateLimiter,
  getProductByBarcode,
);

// New endpoints - external API integration
router.post(
  "/barcode/:barcode/fetch",
  validateParams(BarcodeParamSchema),
  externalApiRateLimiter,
  fetchProductFromExternal,
);

router.post(
  "/bulk-import",
  bulkImportRateLimiter,
  validateRequest(BulkImportSchema),
  bulkImportProducts,
);

export const productsRouter = router;
