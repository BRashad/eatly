import { useState, useCallback } from "react";

import { apiClient } from "@services/api-client";
import type { Product } from "@app-types/product-types";
import { AppError } from "@utils/app-error";

interface UseScanProductResult {
  scanProduct: (barcode: string) => Promise<void>;
  data: Product | null;
  loading: boolean;
  error: AppError | null;
}

export function useScanProduct(): UseScanProductResult {
  const [data, setData] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<AppError | null>(null);

  const scanProduct = useCallback(async (barcode: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get<Product>(
        `/api/products/barcode/${barcode}`
      );
      setData(response.data);
    } catch (err) {
      setData(null);
      if (err instanceof AppError) {
        setError(err);
      } else {
        setError(new AppError("FETCH_FAILED", "Failed to fetch product"));
      }
    } finally {
      setLoading(false);
    }
  }, []);

  return { scanProduct, data, loading, error };
}
