/**
 * Comprehensive product data structure
 * Includes all fields needed for full product analysis and display
 */
import type { NutritionInfo } from "@models/products-schema";

export interface ProductDetail {
  id: string;
  name: string;
  barcode: string;
  brand?: string;
  description?: string;
  ingredients: string[];
  healthScore?: number; // 1-10 scale
  allergens: string[];
  warnings: string[];
  nutritionInfo?: NutritionInfo;
  imageUrl?: string;
  source: string; // 'manual', 'openfoodfacts', 'usda', etc.
  externalId?: string; // ID from external source
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Simplified product data for mobile API responses
 * Excludes large fields and internal metadata
 */
export interface ProductSummary {
  id: string;
  name: string;
  barcode: string;
  brand?: string;
  healthScore?: number;
  imageUrl?: string;
}

/**
 * Product creation data (excluding auto-generated fields)
 */
export interface CreateProductData extends Omit<
  ProductDetail, 
  'id' | 'createdAt' | 'updatedAt'
> {}

/**
 * Product update data (all fields optional)
 */
export interface UpdateProductData extends Partial<
  Omit<
    ProductDetail, 
    'id' | 'createdAt' | 'barcode'
  >
> {}
