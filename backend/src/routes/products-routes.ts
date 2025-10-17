import { Router } from "express";

import { getProductByBarcode, fetchProductFromExternal, bulkImportProducts } from "@controllers/product-controller";

const router = Router();

// Original endpoint - check local database only
router.get("/barcode/:barcode", getProductByBarcode);

// New endpoints - external API integration
router.post("/barcode/:barcode/fetch", fetchProductFromExternal);
router.post("/bulk-import", bulkImportProducts);

export const productsRouter = router;
