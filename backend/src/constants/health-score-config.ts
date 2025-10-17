/**
 * Health Score Configuration
 * Defines thresholds and ingredient lists for calculating product health scores
 * Scores range from 1-10 (1 = worst, 10 = best)
 */

export const HEALTH_SCORE_CONFIG = {
  baseScore: 7,
  thresholds: {
    sodium: 500, // mg per serving
    saturatedFat: 5, // g per serving
    sugars: 15, // g per serving
    lowCalories: 100, // per serving
  },
  concerningIngredients: [
    "high fructose corn syrup",
    "hydrogenated oil",
    "partially hydrogenated",
    "artificial flavor",
    "artificial color",
    "sodium benzoate",
    "potassium sorbate",
    "msg",
    "monosodium glutamate",
    "food coloring",
    "caramel color",
    "sucralose",
    "aspartame",
    "acesulfame potassium",
    "propylene glycol",
    "sodium nitrate",
    "sodium nitrite",
    "bht",
    "bha",
  ],
  beneficialIngredients: [
    "organic",
    "whole grain",
    "whole wheat",
    "extra virgin olive oil",
    "natural flavor",
    "raw",
    "unprocessed",
    "cold pressed",
    "grass fed",
    "free range",
    "wild caught",
    "vine ripened",
    "non gmo",
    "no artificial",
    "gluten free",
    "dairy free",
  ],
} as const;

/**
 * Nutrition thresholds for different dietary considerations
 */
export const NUTRITION_THRESHOLDS = {
  // Sodium thresholds (mg per serving)
  sodium: {
    low: 140,
    moderate: 400,
    high: 600,
  },
  // Saturated fat thresholds (g per serving)
  saturatedFat: {
    low: 3,
    moderate: 8,
    high: 15,
  },
  // Sugar thresholds (g per serving)
  sugars: {
    low: 5,
    moderate: 12,
    high: 20,
  },
  // Calories per serving
  calories: {
    low: 100,
    moderate: 250,
    high: 400,
  },
} as const;

/**
 * Health score calculation weights
 * Used to adjust the impact of different factors on the final score
 */
export const HEALTH_SCORE_WEIGHTS = {
  beneficialIngredient: 1,
  concerningIngredient: -1,
  lowNutritionThreshold: 1,
  highNutritionThreshold: -1,
} as const;
