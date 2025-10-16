import type { Request, Response } from "express";

import { findProductByBarcode } from "@services/product-service";
import { BarcodeParamSchema } from "@validators/product-validator";

export async function getProductByBarcode(
  req: Request,
  res: Response
): Promise<void> {
  const parseResult = BarcodeParamSchema.safeParse(req.params);

  if (!parseResult.success) {
    res.status(400).json({
      error: "INVALID_BARCODE",
      details: parseResult.error.flatten().fieldErrors,
    });
    return;
  }

  const { barcode } = parseResult.data;

  try {
    const product = await findProductByBarcode(barcode);

    if (!product) {
      res.status(404).json({ error: "PRODUCT_NOT_FOUND" });
      return;
    }

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({
      error: "INTERNAL_ERROR",
      message: "An error occurred while fetching the product",
    });
  }
}
