import { eq, desc } from "drizzle-orm";
import type { ProductDetail } from "@app-types/product-types";
import { db, productsTable, productIngredientsTable, ingredientAnalysisTable } from "@models/products-schema";

/**
 * Validation helper functions for product data
 * Ensures data integrity and prevents invalid values
 */

function validatePercentage(percentage?: number): void {
  if (percentage !== undefined && (percentage < 0 || percentage > 100)) {
    throw new Error(`Percentage must be between 0 and 100, received: ${percentage}`);
  }
}

function validateRiskLevel(riskLevel?: string): void {
  if (riskLevel && !['HIGH', 'MEDIUM', 'LOW'].includes(riskLevel)) {
    throw new Error(`Invalid risk level: must be 'HIGH', 'MEDIUM', or 'LOW', received: ${riskLevel}`);
  }
}

/**
 * Repository layer for product data access
 * Handles all database queries for products following the repository pattern
 * Uses optimized queries with proper indexing
 */

async function findByBarcode(barcode: string): Promise<ProductDetail | null> {
  try {
    const product = await db
      .select({
        id: productsTable.id,
        barcode: productsTable.barcode,
        name: productsTable.name,
        brand: productsTable.brand,
        description: productsTable.description,
        ingredients: productsTable.ingredients,
        healthScore: productsTable.healthScore,
        allergens: productsTable.allergens,
        warnings: productsTable.warnings,
        nutritionInfo: productsTable.nutritionInfo,
        imageUrl: productsTable.imageUrl,
        source: productsTable.source,
        externalId: productsTable.externalId,
        createdAt: productsTable.createdAt,
        updatedAt: productsTable.updatedAt,
      })
      .from(productsTable)
      .where(eq(productsTable.barcode, barcode))
      .limit(1);

    if (!product[0]) {
      return null;
    }

    // Convert database nulls to undefined for the interface
    const dbProduct = product[0];
    return {
      ...dbProduct,
      brand: dbProduct.brand || undefined,
      description: dbProduct.description || undefined,
      nutritionInfo: dbProduct.nutritionInfo || undefined,
      imageUrl: dbProduct.imageUrl || undefined,
      externalId: dbProduct.externalId || undefined,
    } as ProductDetail;
  } catch (error) {
    throw new Error(`Failed to find product by barcode: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Create a new product in the database
 * Used when products are fetched from external APIs or added manually
 */
async function create(productData: Omit<ProductDetail, 'id' | 'createdAt' | 'updatedAt'>): Promise<ProductDetail> {
  try {
    // Validate product data
    // Note: percentage validation will be added when we have ingredient creation functions
    
    const [newProduct] = await db
      .insert(productsTable)
      .values({
        ...productData,
        updatedAt: new Date(),
      })
      .returning();

    return newProduct as ProductDetail;
  } catch (error) {
    throw new Error(`Failed to create product: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Update an existing product
 * Used to sync external data or update analysis
 */
async function update(id: string, updates: Partial<Omit<ProductDetail, 'id' | 'createdAt'>>): Promise<ProductDetail> {
  try {
    const [updatedProduct] = await db
      .update(productsTable)
      .set({
        ...updates,
        updatedAt: new Date(),
      })
      .where(eq(productsTable.id, id))
      .returning();

    if (!updatedProduct) {
      throw new Error('Product not found for update');
    }

    return updatedProduct as ProductDetail;
  } catch (error) {
    throw new Error(`Failed to update product: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Find or create a product by barcode
 * Common pattern for external API responses
 */
async function findOrCreate(barcode: string, createData: Omit<ProductDetail, 'id' | 'createdAt' | 'updatedAt'>): Promise<ProductDetail> {
  try {
    // First try to find existing product
    const existing = await findByBarcode(barcode);
    if (existing) {
      return existing;
    }

    // Create new product if not found
    return await create({
      ...createData,
      barcode,
    });
  } catch (error) {
    throw new Error(`Failed to find or create product: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Get products with pagination (for admin/debug use)
 * Not used in main mobile app flow
 */
async function getPaginated(page: number = 1, limit: number = 25): Promise<ProductDetail[]> {
  try {
    const offset = (page - 1) * limit;

    const products = await db
      .select({
        id: productsTable.id,
        barcode: productsTable.barcode,
        name: productsTable.name,
        brand: productsTable.brand,
        description: productsTable.description,
        ingredients: productsTable.ingredients,
        healthScore: productsTable.healthScore,
        allergens: productsTable.allergens,
        warnings: productsTable.warnings,
        nutritionInfo: productsTable.nutritionInfo,
        imageUrl: productsTable.imageUrl,
        source: productsTable.source,
        externalId: productsTable.externalId,
        createdAt: productsTable.createdAt,
        updatedAt: productsTable.updatedAt,
      })
      .from(productsTable)
      .limit(limit)
      .offset(offset)
      .orderBy(desc(productsTable.createdAt));

    return products as ProductDetail[];
  } catch (error) {
    throw new Error(`Failed to get paginated products: ${error instanceof Error ? error.message : String(error)}`);
  }
}

export const productRepository = {
  findByBarcode,
  create,
  update,
  findOrCreate,
  getPaginated,
};
