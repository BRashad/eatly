import type { ProductDetail, CreateProductData } from '@app-types/product-types';

import { externalApiService } from '@services/external-api-service';
import { productRepository } from '@repositories/product-repository';
import { logInfo, logError } from '@utils/logger';

/**
 * Product Data Pipeline Service
 * Orchestrates fetching, transforming, and storing product data from external APIs
 * Handles duplicate detection, data normalization, and health score calculation
 */

class ProductDataPipeline {
  /**
   * Fetch product by barcode from external APIs and store in database
   * Implements find-or-create pattern to avoid duplicates
   */
  async fetchAndStoreProduct(barcode: string): Promise<ProductDetail | null> {
    try {
      logInfo('Starting product data pipeline', {
        barcode,
        action: 'pipeline_start',
      });

      // First, check if product already exists in our database
      const existingProduct = await productRepository.findByBarcode(barcode);
      if (existingProduct) {
        logInfo('Product already exists in database', {
          barcode,
          productId: existingProduct.id,
          source: existingProduct.source,
          action: 'product_exists',
        });
        return existingProduct;
      }

      // Fetch from external APIs
      const externalProduct = await this.fetchFromMultipleSources(barcode);
      if (!externalProduct) {
        logInfo('Product not found in external APIs', {
          barcode,
          action: 'product_not_found_externally',
        });
        return null;
      }

      // Calculate health score based on ingredients and nutrition
      externalProduct.healthScore = this.calculateHealthScore(externalProduct);

      // Analyze ingredients for warnings
      externalProduct.warnings = await this.analyzeIngredientsForWarnings(externalProduct.ingredients);

      // Store in database
      const storedProduct = await productRepository.create(externalProduct);

      logInfo('Product successfully stored in database', {
        barcode,
        productId: storedProduct.id,
        source: storedProduct.source,
        healthScore: storedProduct.healthScore,
        action: 'product_stored',
      });

      return storedProduct;
    } catch (error) {
      logError('Product data pipeline failed', error instanceof Error ? error : new Error(String(error)), {
        barcode,
        action: 'pipeline_error',
      });
      throw new Error(`Failed to fetch and store product: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Fetch product from multiple external APIs in priority order
   */
  private async fetchFromMultipleSources(barcode: string): Promise<CreateProductData | null> {
    // Try Open Food Facts first (most comprehensive)
    try {
      const offProduct = await externalApiService.fetchProductByBarcode(barcode);
      if (offProduct) {
        logInfo('Product found in Open Food Facts', {
          barcode,
          source: 'openfoodfacts',
          action: 'external_api_success',
        });
        return offProduct;
      }
    } catch (error) {
      logError('Open Food Facts API error while fetching product', error instanceof Error ? error : new Error(String(error)), {
        barcode,
        source: 'openfoodfacts',
        action: 'external_api_error',
      });
    }

    // TODO: Try USDA as fallback
    // try {
    //   const usdaProduct = await externalApiService.fetchFromUSDA(barcode);
    //   if (usdaProduct) return usdaProduct;
    // } catch (error) {
    //   logError('USDA API error while fetching product', error, { barcode, source: 'usda' });
    // }

    return null;
  }

  /**
   * Calculate health score based on ingredients and nutrition
   * Returns score 1-10 (1 = worst, 10 = best)
   */
  private calculateHealthScore(product: CreateProductData): number | undefined {
    if (!product.ingredients || product.ingredients.length === 0) return undefined;

    let score = 7; // Start with neutral score
    
    // Deduct points for concerning ingredients
    const concerningIngredients = [
      'high fructose corn syrup', 'hydrogenated oil', 'partially hydrogenated',
      'artificial flavor', 'artificial color', 'sodium benzoate',
      'potassium sorbate', 'msg', 'monosodium glutamate', 'food coloring'
    ];

    const beneficialIngredients = [
      'organic', 'whole grain', 'whole wheat', 'extra virgin olive oil',
      'natural flavor', 'raw', 'unprocessed'
    ];

    product.ingredients.forEach(ingredient => {
      const ingredientLower = ingredient.toLowerCase();
      
      // Check for concerning ingredients
      const isConcerning = concerningIngredients.some(concerning => 
        ingredientLower.includes(concerning)
      );
      
      // Check for beneficial ingredients  
      const isBeneficial = beneficialIngredients.some(beneficial =>
        ingredientLower.includes(beneficial)
      );

      if (isConcerning) {
        score = Math.max(1, score - 1); // Deduct point, minimum score 1
      } else if (isBeneficial) {
        score = Math.min(10, score + 1); // Add point, maximum score 10
      }
    });

    // Adjust based on nutrition if available
    if (product.nutritionInfo) {
      const { calories, sodium, saturatedFat, sugars } = product.nutritionInfo;
      
      // High sodium penalty
      if (sodium && sodium > 500) { // mg per serving
        score = Math.max(1, score - 1);
      }
      
      // High saturated fat penalty
      if (saturatedFat && saturatedFat > 5) { // g per serving
        score = Math.max(1, score - 1);
      }
      
      // High sugars penalty
      if (sugars && sugars > 15) { // g per serving
        score = Math.max(1, score - 1);
      }
      
      // Low calories bonus
      if (calories && calories < 100) { // per serving
        score = Math.min(10, score + 1);
      }
    }

    return score;
  }

  /**
   * Analyze ingredients for potential warnings
   */
  private async analyzeIngredientsForWarnings(ingredients: string[]): Promise<string[]> {
    const warnings: string[] = [];
    
    if (!ingredients || ingredients.length === 0) return warnings;

    // Common allergens and warnings
    const allergenMap: Record<string, string> = {
      'milk': 'Contains dairy - may cause allergic reactions',
      'wheat': 'Contains gluten - may cause celiac reactions',
      'soy': 'Contains soy - common allergen',
      'peanut': 'Contains peanuts - severe allergic reactions',
      'tree nut': 'Contains tree nuts - severe allergic reactions',
      'egg': 'Contains eggs - common allergen',
      'fish': 'Contains fish - may trigger allergic reactions',
      'shellfish': 'Contains shellfish - may trigger allergic reactions',
    };

    // Warning ingredients
    const warningIngredients: Record<string, string> = {
      'aspartame': 'Contains artificial sweetener - may cause sensitivities',
      'high fructose corn syrup': 'Contains refined sugar - may impact metabolism',
      'hydrogenated': 'Contains hydrogenated oils - contains trans fats',
      'msg': 'Contains MSG - may cause sensitivities in some people',
      'sodium nitrate': 'Contains sodium nitrite - processed meat preservative',
    };

    ingredients.forEach(ingredient => {
      const ingredientLower = ingredient.toLowerCase();
      
      // Check for allergens
      for (const [allergen, warning] of Object.entries(allergenMap)) {
        if (ingredientLower.includes(allergen) && !warnings.find(w => w.includes('allergic'))) {
          warnings.push(warning);
          break;
        }
      }
      
      // Check for warning ingredients
      for (const [ingredientName, warning] of Object.entries(warningIngredients)) {
        if (ingredientLower.includes(ingredientName)) {
          warnings.push(warning);
          break;
        }
      }
    });

    return warnings.slice(0, 5); // Limit to 5 warnings for readability
  }

  /**
   * Bulk import products for testing and data population
   */
  async importProductsBySearch(searchTerms: string[], limitPerTerm: number = 10): Promise<{
    imported: number;
    duplicates: number;
    errors: number;
    details: string[];
  }> {
    const results = {
      imported: 0,
      duplicates: 0,
      errors: 0,
      details: [] as string[],
    };

    logInfo('Starting bulk product import', {
      searchTerms,
      limitPerTerm,
      action: 'bulk_import_start',
    });

    for (const searchTerm of searchTerms.slice(0, 5)) { // Limit to 5 search terms
      try {
        const searchResult = await externalApiService.searchProducts(searchTerm, 1, limitPerTerm);
        
        for (const product of searchResult.products) {
          try {
            // Check if already exists
            const existing = await productRepository.findByBarcode(product.barcode);
            if (existing) {
              results.duplicates++;
              continue;
            }

            // Try to import
            await this.fetchAndStoreProduct(product.barcode);
            results.imported++;
          } catch (error) {
            results.errors++;
            results.details.push(`Failed to import ${product.barcode}: ${error instanceof Error ? error.message : String(error)}`);
          }
        }
      } catch (error) {
        results.errors++;
        results.details.push(`Failed to search "${searchTerm}": ${error instanceof Error ? error.message : String(error)}`);
      }
    }

    logInfo('Bulk product import completed', {
      searchTerms,
      imported: results.imported,
      duplicates: results.duplicates,
      errors: results.errors,
      action: 'bulk_import_complete',
    });

    return results;
  }
}

// Export singleton instance
export const productDataPipeline = new ProductDataPipeline();
