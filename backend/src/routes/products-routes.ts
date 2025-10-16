import { Router } from "express";

import { getProductByBarcode } from "@controllers/product-controller";

const router = Router();

router.get("/barcode/:barcode", getProductByBarcode);

export const productsRouter = router;
