import type { ProductDetail } from "@app-types/product-types";

const MOCK_PRODUCTS: ProductDetail[] = [
  {
    id: "1",
    name: "Demo Protein Bar",
    barcode: "012345678901",
    healthScore: 72,
  },
];

async function findByBarcode(barcode: string): Promise<ProductDetail | null> {
  const product = MOCK_PRODUCTS.find((item) => item.barcode === barcode);
  return product ?? null;
}

export const productRepository = {
  findByBarcode,
};
