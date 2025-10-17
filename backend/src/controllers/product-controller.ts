import type { Request, Response } from "express";

import { findProductByBarcode } from "@services/product-service";
import { productDataPipeline } from "@services/product-data-pipeline";
import { BarcodeParamSchema } from "@validators/product-validator";

export async function getProductByBarcode(
  req: Request,
  res: Response,
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
  } catch {
    res.status(500).json({
      error: "INTERNAL_ERROR",
      message: "An error occurred while fetching the product",
    });
  }
}

/**
 * Fetch product from external APIs and store in database
 * This endpoint handles the complete data pipeline for external product integration
 */
export async function fetchProductFromExternal(
  req: Request,
  res: Response,
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
    const product = await productDataPipeline.fetchAndStoreProduct(barcode);

    if (!product) {
      res.status(404).json({ 
        error: "PRODUCT_NOT_FOUND",
        message: "Product not found in external APIs" 
      });
      return;
    }

    res.status(200).json({
      success: true,
      product,
      message: "Product successfully fetched and stored from external data source"
    });
  } catch {
    res.status(500).json({
      error: "EXTERNAL_FETCH_ERROR",
      message: "Failed to fetch product from external APIs"
    });
  }
}

/**
 * Bulk import products for testing and data population
 */
export async function bulkImportProducts(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const { searchTerms, limitPerTerm = 10 } = req.body;

    if (!searchTerms || !Array.isArray(searchTerms) || searchTerms.length === 0) {
      res.status(400).json({
        error: "INVALID_REQUEST",
        message: "searchTerms is required and must be a non-empty array"
      });
      return;
    }

    if (searchTerms.length > 5) {
      res.status(400).json({
        error: "INVALID_REQUEST", 
        message: "Maximum 5 search terms allowed"
      });
      return;
    }

    const results = await productDataPipeline.importProductsBySearch(searchTerms, limitPerTerm);

    res.status(200).json({
      success: true,
      results,
      message: `Import completed: ${results.imported} products imported, ${results.duplicates} duplicates, ${results.errors} errors`
    });
  } catch {
    res.status(500).json({
      error: "BULK_IMPORT_ERROR",
      message: "Failed to bulk import products"
    });
  }
}
