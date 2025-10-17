import { 
  pgTable, 
  uuid, 
  text, 
  timestamp, 
  decimal, 
  integer, 
  boolean,
  jsonb,
  index,
  uniqueIndex
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
// Import db from the main database configuration
export { db } from "@config/database";

/**
 * Nutrition information interface for JSONB column
 * Provides type safety for nutrition data stored in database
 */
export interface NutritionInfo {
  calories?: number;
  protein?: number; // grams
  carbohydrates?: number; // grams
  fat?: number; // grams
  saturatedFat?: number; // grams
  transFat?: number; // grams
  cholesterol?: number; // mg
  sodium?: number; // mg
  dietaryFiber?: number; // grams
  sugars?: number; // grams
  vitaminA?: number; // IU
  vitaminC?: number; // mg
  calcium?: number; // mg
  iron?: number; // mg
  potassium?: number; // mg
  servingSize?: string; // e.g., "100g" or "1 cup"
  servingsPerContainer?: number;
}

/**
 * Products table - stores product information and health analysis
 * Follows immutable data pattern with createdAt timestamp
 * Uses UUID for primary key for security and scalability
 */
export const productsTable = pgTable('products', {
  id: uuid('id').primaryKey().defaultRandom(),
  barcode: text('barcode').notNull().unique(),
  name: text('name').notNull(),
  brand: text('brand'),
  description: text('description'),
  ingredients: text('ingredients').array().notNull().default([]),
  healthScore: integer('health_score'), // 1-10 scale, null if not calculated
  allergens: text('allergens').array().notNull().default([]),
  warnings: text('warnings').array().notNull().default([]),
  nutritionInfo: jsonb('nutrition_info').$type<NutritionInfo>(), // JSONB for structured nutrition data
  imageUrl: text('image_url'),
  source: text('source').notNull().default('manual'), // 'manual', 'openfoodfacts', 'usda', etc
  externalId: text('external_id'), // ID from external source
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  // Index for fast barcode lookups (primary query pattern)
  barcodeIdx: index('idx_products_barcode').on(table.barcode),
  // Index for search by name
  nameIdx: index('idx_products_name').on(table.name),
  // Unique constraint on external source+ID when externalId is not null
  // Only enforce uniqueness for products from external APIs, manual entries can have null externalId
  sourceExternalIdIdx: uniqueIndex('idx_products_source_external_id')
    .on(table.source, table.externalId)
    .where(sql`${table.externalId} IS NOT NULL`),
}));

/**
 * User scan history - tracks which products users have scanned
 * Enables personalized recommendations and scan analytics
 */
export const userScanHistoryTable = pgTable('user_scan_history', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: text('user_id').notNull(), // Will be expanded when user auth is added
  productId: uuid('product_id').references(() => productsTable.id, { onDelete: 'cascade' }).notNull(),
  scannedAt: timestamp('scanned_at').defaultNow().notNull(),
  deviceInfo: text('device_info'), // JSON string for device/platform info
}, (table) => ({
  // Fast lookups for user's scan history
  userIdIdx: index('idx_user_scan_history_user_id').on(table.userId),
  // Recent scans by user
  userScannedAtIdx: index('idx_user_scan_history_user_scanned_at').on(table.userId, table.scannedAt.desc()),
  // Popular products (by scan count)
  productIdIdx: index('idx_user_scan_history_product_id').on(table.productId),
}));

/**
 * Ingredient analysis - stores ingredient risk information
 * Pre-populated with known harmful ingredients and their levels
 */
export const ingredientAnalysisTable = pgTable('ingredient_analysis', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull().unique(),
  commonNames: text('common_names').array().notNull().default([]), // Alternative names
  riskLevel: text('risk_level', { enum: ['HIGH', 'MEDIUM', 'LOW'] }).notNull().default('LOW'), // 'HIGH', 'MEDIUM', or 'LOW'
  healthImpact: text('health_impact'), // Description of health effects
  regulatoryStatus: text('regulatory_status'), // 'BANNED', 'RESTRICTED', 'APPROVED', etc
  sources: text('sources').array().notNull().default([]), // References to studies/regulations
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  nameIdx: index('idx_ingredient_analysis_name').on(table.name),
  riskLevelIdx: index('idx_ingredient_analysis_risk_level').on(table.riskLevel),
}));

/**
 * Product ingredient mapping - Many-to-many relationship
 * Links products to their ingredients with specific data
 */
export const productIngredientsTable = pgTable('product_ingredients', {
  id: uuid('id').primaryKey().defaultRandom(),
  productId: uuid('product_id').references(() => productsTable.id, { onDelete: 'cascade' }).notNull(),
  ingredientName: text('ingredient_name').notNull(),
  isTopLevel: boolean('is_top_level').notNull().default(true),
  position: integer('position'), // Order in ingredients list
  percentage: integer('percentage'), // Percentage if declared (0-100)
  addedAt: timestamp('added_at').defaultNow().notNull(),
}, (table) => ({
  productIdIdx: index('idx_product_ingredients_product_id').on(table.productId),
  ingredientNameIdx: index('idx_product_ingredients_ingredient_name').on(table.ingredientName),
}));
