import { Platform } from 'react-native';

const API_BASE_URL = Platform.select({
  ios: 'http://localhost:5001/api',
  android: 'http://10.0.2.2:5001/api',
  default: 'http://localhost:5001/api',
});

export interface ProductDetail {
  id: string;
  barcode: string;
  name: string;
  brand?: string;
  description?: string;
  ingredients?: string[];
  nutritionInfo?: {
    calories?: number;
    protein?: number;
    carbs?: number;
    fat?: number;
    sodium?: number;
    saturatedFat?: number;
    sugars?: number;
    fiber?: number;
  };
  healthScore?: number;
  warnings?: string[];
  source: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

class ApiService {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${API_BASE_URL}${endpoint}`;
      
      const config: RequestInit = {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      };

      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.error || `HTTP ${response.status}: ${response.statusText}`,
        };
      }

      return {
        success: true,
        data: data.data || data,
      };
    } catch (error) {
      console.error('API request failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error',
      };
    }
  }

  async getProductByBarcode(barcode: string): Promise<ApiResponse<ProductDetail>> {
    return this.request<ProductDetail>(`/products/barcode/${encodeURIComponent(barcode)}`);
  }

  async searchProducts(
    query: string,
    page: number = 1,
    limit: number = 20
  ): Promise<ApiResponse<{ products: ProductDetail[]; total: number; page: number; totalPages: number }>> {
    const params = new URLSearchParams({
      q: query,
      page: page.toString(),
      limit: limit.toString(),
    });
    
    return this.request(`/products/search?${params}`);
  }

  async getPopularProducts(limit: number = 10): Promise<ApiResponse<ProductDetail[]>> {
    return this.request(`/products/popular?limit=${limit}`);
  }

  async getRecentScans(limit: number = 10): Promise<ApiResponse<ProductDetail[]>> {
    return this.request(`/products/recent?limit=${limit}`);
  }
}

export const apiService = new ApiService();
