/** Describes a scanned food product. */
export interface Product {
  /** Unique product identifier. */
  id: string;
  /** Display name of the product. */
  name: string;
  /** Product barcode or UPC. */
  barcode: string;
  /** Optional health or nutrition score (0-100). */
  healthScore?: number;
}
