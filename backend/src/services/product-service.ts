import type { ProductDetail } from "@app-types/product-types";

import { productRepository } from "@repositories/product-repository";

export async function findProductByBarcode(
  barcode: string
): Promise<ProductDetail | null> {
  return productRepository.findByBarcode(barcode);
}
