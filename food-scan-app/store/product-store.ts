import { create } from 'zustand';

import type { Product } from '@app-types/product-types';

interface ProductStore {
  products: Product[];
  selectedProduct: Product | null;
  setSelectedProduct: (product: Product | null) => void;
  hydrateProducts: (items: Product[]) => void;
}

export const useProductStore = create<ProductStore>((set) => ({
  products: [],
  selectedProduct: null,
  setSelectedProduct: (product) => set({ selectedProduct: product }),
  hydrateProducts: (items) => set({ products: items }),
}));
