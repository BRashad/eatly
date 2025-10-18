import type { Request, Response } from "express";

import { logError } from "@utils/logger";
import { findProductByBarcode } from "@services/product-service";
import { productDataPipeline } from "@services/product-data-pipeline";
import { hasBarcodeParams, hasBulkImportBody } from "@app-types/express-extensions";
import type { BarcodeParam, BulkImportRequest } from "@validators/product-validator";

export async function getProductByBarcode(
  req: Request,
  res: Response,
): Promise<void> {
  if (!hasBarcodeParams(req)) {
    res.status(400).json({ error: "INVALID_BARCODE" });
    return;
  }
  
  const { barcode } = req.validatedParams;

  try {
    const product = await findProductByBarcode(barcode);

    if (!product) {
      res.status(404).json({ error: "PRODUCT_NOT_FOUND" });
      return;
    }

    res.status(200).json(product);
  } catch (error) {
    logError(
      "Failed to fetch product from database",
      error instanceof Error ? error : new Error(String(error)),
      {
        barcode,
        action: "controller_db_fetch_error",
      },
    );
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
  if (!hasBarcodeParams(req)) {
    res.status(400).json({ error: "INVALID_BARCODE" });
    return;
  }
  
  const { barcode } = req.validatedParams;

  try {
    const product = await productDataPipeline.fetchAndStoreProduct(barcode);

    if (!product) {
      res.status(404).json({
        error: "PRODUCT_NOT_FOUND",
        message: "Product not found in external APIs",
      });
      return;
    }

    res.status(200).json({
      success: true,
      product,
      message:
        "Product successfully fetched and stored from external data source",
    });
  } catch (error) {
    logError(
      "Failed to fetch product from external API",
      error instanceof Error ? error : new Error(String(error)),
      {
        barcode,
        action: "controller_fetch_error",
      },
    );
    res.status(500).json({
      error: "EXTERNAL_FETCH_ERROR",
      message: "Failed to fetch product from external APIs",
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
    if (!hasBulkImportBody(req)) {
      res.status(400).json({ error: "INVALID_REQUEST" });
      return;
    }
    
    const { searchTerms, limitPerTerm = 10 } = req.validatedBody;

    if (
      !searchTerms ||
      !Array.isArray(searchTerms) ||
      searchTerms.length === 0 ||
      searchTerms.some(
        (term) => typeof term !== "string" || term.trim().length === 0,
      )
    ) {
      res.status(400).json({
        error: "INVALID_REQUEST",
        message:
          "searchTerms is required and must be a non-empty array of valid strings",
      });
      return;
    }

    if (searchTerms.length > 5) {
      res.status(400).json({
        error: "INVALID_REQUEST",
        message: "Maximum 5 search terms allowed",
      });
      return;
    }

    if (
      typeof limitPerTerm !== "number" ||
      limitPerTerm < 1 ||
      limitPerTerm > 50
    ) {
      res.status(400).json({
        error: "INVALID_REQUEST",
        message: "limitPerTerm must be a number between 1 and 50",
      });
      return;
    }

    const results = await productDataPipeline.importProductsBySearch(
      searchTerms,
      limitPerTerm,
    );

    res.status(200).json({
      success: true,
      results,
      message: `Import completed: ${results.imported} products imported, ${results.duplicates} duplicates, ${results.errors} errors`,
    });
  } catch (error) {
    logError(
      "Failed to bulk import products",
      error instanceof Error ? error : new Error(String(error)),
      {
        action: "controller_bulk_import_error",
      },
    );
    res.status(500).json({
      error: "BULK_IMPORT_ERROR",
      message: "Failed to bulk import products",
    });
  }
}
