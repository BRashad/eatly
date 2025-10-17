import axios, { AxiosInstance, AxiosError } from 'axios';

import { environment } from '@config/environment';
import { logInfo, logError } from '@utils/logger';

// Type definitions for Open Food Facts API responses
interface OpenFoodFactsProduct {
  code?: string;
  product_name: string;
  generic_name?: string;
  brands?: string;
  ingredients_text: string;
  nutriments?: Record<string, string>;
  allergens?: string;
  image_url?: string;
  _id?: string;
  status?: number;
}

interface OpenFoodFactsSearchResponse {
  products?: OpenFoodFactsProduct[];
  count?: number;
  page_size?: number;
}

/**
 * External API Integration Service
 * Handles fetching product data from external APIs like Open Food Facts
 * Follows rate limiting and error handling best practices
 */

class ExternalApiService {
  private openFoodFactsClient: AxiosInstance;
  private usdaClient: AxiosInstance;

  constructor() {
    // Open Food Facts API client
    this.openFoodFactsClient = axios.create({
      baseURL: 'https://world.openfoodfacts.org/api/v0',
      timeout: 15000,
      headers: {
        'User-Agent': 'FoodScanApp/1.0',
        'accept': 'application/json',
      },
    });

    // USDA Food Data Central API client
    this.usdaClient = axios.create({
      baseURL: 'https://api.nal.usda.gov/fdc/v1',
      timeout: 15000,
      headers: {
        'accept': 'application/json',
      },
    });

    // Request interceptors for logging
    this.openFoodFactsClient.interceptors.request.use(
      (config: AxiosRequestConfig) => {
        logInfo('Open Food Facts API request', {
          url: config.url,
          method: config.method?.toUpperCase(),
          action: 'external_api_request',
        });
        return config;
      },
      (error: AxiosError) => {
        logError('Open Food Facts API request error', error, {
          action: 'external_api_request_error',
        });
        return Promise.reject(error);
      }
    );

    this.openFoodFactsClient.interceptors.response.use(
      (response) => {
        logInfo('Open Food Facts API response', {
          status: response.status,
          url: response.config.url,
          action: 'external_api_response',
        });
        return response;
      },
      (error: AxiosError) => {
        logError('Open Food Facts API response error', error, {
          status: error.response?.status,
          url: error.config?.url,
          action: 'external_api_response_error',
        });
        return Promise.reject(error);
      }
    );
  }

  /**
   * Fetch product by barcode from Open Food Facts
   */
  async fetchProductByBarcode(barcode: string) {
    try {
      const response = await this.openFoodFactsClient.get(`/product/${barcode}`);
      
      if (response.data.status === 0) {
        return null; // Product not found
      }

      return this.transformOpenFoodFactsProduct(response.data.product);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;
        if (axiosError.response?.status === 404) {
          return null; // Product not found
        }
        throw new Error(`Open Food Facts API error: ${axiosError.response?.status} - ${axiosError.response?.statusText}`);
      }
      throw new Error(`Failed to fetch product from Open Food Facts: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Search products by name (for testing and data population)
   */
  async searchProducts(searchTerm: string, page: number = 1, pageSize: number = 20): Promise<OpenFoodFactsSearchResponse> {
    try {
      const response = await this.openFoodFactsClient.get('/search', {
        params: {
          search_terms: searchTerm,
          page,
          page_size: pageSize,
          sort_by: 'unique_scans_n',
          fields: 'product_name,code,image_url,nutriments,ingredients_text,allergens' 
        },
      });

      if (response.data.products) {
        return {
          products: response.data.products.map(product => 
            this.transformOpenFoodFactsProduct(product)
          ),
          count: response.data.count,
          pageSize: response.data.page_size,
        };
      }

      return { products: [], count: 0, pageSize: 0 };
    } catch (error) {
      throw new Error(`Failed to search products from Open Food Facts: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Transform Open Food Facts product data to our internal format
   */
  private transformOpenFoodFactsProduct(ofProduct: OpenFoodFactsProduct): any {
    return {
      barcode: ofProduct.code || ofProduct._id?.split('#')[1] || '',
      name: ofProduct.product_name || 'Unknown Product',
      brand: ofProduct.brands || '',
      description: this.extractDescription(ofProduct),
      ingredients: this.extractIngredients(ofProduct.ingredients_text),
      healthScore: undefined, // Will be calculated later
      allergens: this.extractAllergens(ofProduct.allergens || ''),
      warnings: [], // Will be analyzed later
      nutritionInfo: this.extractNutritionInfo(ofProduct.nutriments || {}),
      imageUrl: ofProduct.image_url || '',
      source: 'openfoodfacts',
      externalId: ofProduct._id || '',
    };
  }

  /**
   * Extract product description from Open Food Facts data
   */
  private extractDescription(product: OpenFoodFactsProduct): string {
    const ingredientsList = Object.entries(product)
      .filter(([key]) => key.startsWith('ingredients_text'))
      .map(([, value]) => value)
      .join(' ');
    
    return product.generic_name || product.ingredients_text || ingredientsList || '';
  }

  /**
   * Parse and clean ingredients list
   */
  private extractIngredients(ingredientsText?: string): string[] {
    if (!ingredientsText) return [];
    
    return ingredientsText
      .toLowerCase()
      .split(/[,.;:]/)
      .map(ingredient => ingredient.trim())
      .filter(ingredient => ingredient.length > 0)
      .filter((ingredient, index, arr) => arr.indexOf(ingredient) === index) // Remove duplicates
      .slice(0, 50); // Limit to first 50 ingredients
  }

  /**
   * Extract allergens from allergen tags
   */
  private extractAllergens(allergens: string): string[] {
    if (!allergens) return [];
    
    return allergens
      .toLowerCase()
      .replace(/[<>]/g, '')
      .split(/[,;]/)
      .map(allergen => allergen.trim())
      .filter(allergen => allergen.length > 0)
      .filter((allergen, index, arr) => arr.indexOf(allergen) === index) // Remove duplicates
      .slice(0, 10); // Limit to first 10 allergens
  }

  /**
   * Extract nutrition information from Open Food Facts nutriments
   */
  private extractNutritionInfo(nutriments: Record<string, string> | undefined): object {
    if (!nutriments || typeof nutriments !== 'object') return {};

    return {
      calories: this.safeExtractNumber(nutriments['energy-kcal_100g']),
      protein: this.safeExtractNumber(nutriments.proteins_100g),
      carbohydrates: this.safeExtractNumber(nutriments.carbohydrates_100g),
      fat: this.safeExtractNumber(nutriments.fat_100g),
      saturatedFat: this.safeExtractNumber(nutriments['saturated-fat_100g']),
      transFat: this.safeExtractNumber(nutriments['trans-fat_100g']),
      cholesterol: this.safeExtractNumber(nutriments.cholesterol_100g),
      sodium: this.safeExtractNumber(nutriments.sodium_100g),
      dietaryFiber: this.safeExtractNumber(nutriments.fiber_100g),
      sugars: this.safeExtractNumber(nutriments.sugars_100g),
      vitaminA: this.safeExtractNumber(nutriments['vitamin-a_100g']),
      vitaminC: this.safeExtractNumber(nutriments['vitamin-c_100g']),
      calcium: this.safeExtractNumber(nutriments.calcium_100g),
      iron: this.safeExtractNumber(nutriments.iron_100g),
      potassium: this.safeExtractNumber(nutriments.potassium_100g),
      servingSize: '100g',
    };
  }

  /**
   * Safely extract number from nutriments, handling various formats
   */
  private safeExtractNumber(value: string | undefined): number | undefined {
    if (value === null || value === undefined) return undefined;
    
    const num = parseFloat(value.replace(/[^\d.-]/g, ''));
    return isNaN(num) ? undefined : num;
  }
}

export const externalApiService = new ExternalApiService();
